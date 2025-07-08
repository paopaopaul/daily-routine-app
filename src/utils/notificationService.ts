import { RoutineItem } from '../types';

// 通知定时器接口
interface NotificationTimer {
  id: string;
  routineId: string;
  routine: RoutineItem; // 保存完整的routine信息
  timerId: NodeJS.Timeout;
  snoozeTimerId?: NodeJS.Timeout;
  isSnoozed: boolean;
  snoozeEndTime?: number;
}

class NotificationService {
  private timers: Map<string, NotificationTimer> = new Map();
  private isEnabled: boolean = true;
  private defaultSnooze: number = 5;
  private notificationStyle: 'banner' | 'alert' = 'banner';
  private onShowAlert?: (routine: RoutineItem) => void;
  private onStartEvent?: (routineId: string) => void;

  // 初始化通知服务
  init(onShowAlert: (routine: RoutineItem) => void, onStartEvent: (routineId: string) => void) {
    this.onShowAlert = onShowAlert;
    this.onStartEvent = onStartEvent;
    
    // 检查通知权限
    this.checkNotificationPermission();
  }

  // 检查通知权限
  private checkNotificationPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          console.warn('Notification permission denied');
        }
      });
    }
  }

  // 设置通知开关
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.clearAllTimers();
    }
  }

  // 设置默认Snooze时间
  setDefaultSnooze(minutes: number) {
    this.defaultSnooze = minutes;
  }

  // 设置通知样式
  setNotificationStyle(style: 'banner' | 'alert') {
    this.notificationStyle = style;
  }

  // 添加事件通知
  addEventNotification(routine: RoutineItem) {
    if (!this.isEnabled) return;

    const timerId = this.scheduleNotification(routine);
    if (timerId) {
      this.timers.set(routine.id, {
        id: routine.id,
        routineId: routine.id,
        routine, // 保存完整的routine信息
        timerId,
        isSnoozed: false
      });
    }
  }

  // 移除事件通知
  removeEventNotification(routineId: string) {
    const timer = this.timers.get(routineId);
    if (timer) {
      clearInterval(timer.timerId);
      if (timer.snoozeTimerId) {
        clearTimeout(timer.snoozeTimerId);
      }
      this.timers.delete(routineId);
    }
  }

  // 清除所有定时器
  clearAllTimers() {
    this.timers.forEach(timer => {
      clearInterval(timer.timerId);
      if (timer.snoozeTimerId) {
        clearTimeout(timer.snoozeTimerId);
      }
    });
    this.timers.clear();
  }

  // 调度通知
  private scheduleNotification(routine: RoutineItem): NodeJS.Timeout | null {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const [hours, minutes] = routine.time.split(':').map(Number);
    
    // 计算事件开始时间
    const eventStartTime = new Date(today);
    eventStartTime.setHours(hours, minutes, 0, 0);
    
    // 计算提醒时间（提前5分钟）
    const reminderTime = new Date(eventStartTime);
    reminderTime.setMinutes(reminderTime.getMinutes() - 5);
    
    // 如果提醒时间已过，不设置定时器
    if (reminderTime <= now) {
      return null;
    }

    // 计算延迟时间
    const delay = reminderTime.getTime() - now.getTime();
    
    // 设置定时器
    const timerId = setTimeout(() => {
      this.showNotification(routine);
      // 开始重复提醒
      this.startRepeatingNotification(routine);
    }, delay);

    return timerId as any;
  }

  // 开始重复通知
  private startRepeatingNotification(routine: RoutineItem) {
    const timer = this.timers.get(routine.id);
    if (!timer) return;

    // 清除原来的定时器
    clearTimeout(timer.timerId);
    
    // 设置重复提醒（每1分钟）
    timer.timerId = setInterval(() => {
      if (!timer.isSnoozed) {
        this.showNotification(routine);
      }
    }, 60000) as any;
  }

  // 显示通知
  private showNotification(routine: RoutineItem) {
    // 显示桌面通知
    this.showDesktopNotification(routine);
    
    // 显示应用内Alert
    if (this.onShowAlert) {
      this.onShowAlert(routine);
    }
  }

  // 显示桌面通知
  private showDesktopNotification(routine: RoutineItem) {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    // 检查权限
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.createNotification(routine);
        } else {
          console.warn('Notification permission denied');
        }
      });
    } else if (Notification.permission === 'granted') {
      this.createNotification(routine);
    }
  }

  // 创建通知
  private createNotification(routine: RoutineItem) {
    const notificationOptions: NotificationOptions = {
      body: `${routine.title}\n时间: ${routine.time} - ${routine.endTime}`,
      icon: '/favicon.ico', // 如果有图标的话
      silent: false,
      tag: `routine-${routine.id}`, // 防止重复通知
      data: {
        routineId: routine.id,
        action: 'start'
      }
    };

    // 根据通知样式设置不同的选项
    if (this.notificationStyle === 'alert') {
      notificationOptions.requireInteraction = true; // 需要用户交互才关闭
    } else {
      notificationOptions.requireInteraction = false; // 横幅模式自动消失
    }

    const notification = new Notification('事件提醒', notificationOptions);

    // 点击通知时的处理
    notification.onclick = (event) => {
      event.preventDefault();
      
      // 聚焦窗口（在Electron中）
      if (window.electronAPI) {
        window.electronAPI.focusWindow();
      } else {
        // 在浏览器中，尝试聚焦窗口
        window.focus();
      }
      
      // 关闭通知
      notification.close();
      
      // 触发开始事件
      this.handleStartEvent(routine.id);
    };

    // 通知关闭时的处理
    notification.onclose = () => {
      console.log('Notification closed for:', routine.title);
    };

    // 通知显示时的处理
    notification.onshow = () => {
      console.log('Notification shown for:', routine.title);
    };

    // 自动关闭通知（根据样式设置不同的时间）
    if (this.notificationStyle === 'banner') {
      setTimeout(() => {
        notification.close();
      }, 10000); // 横幅模式10秒后自动关闭
    }
    // Alert模式不自动关闭，需要用户手动关闭
  }

  // 处理开始事件
  handleStartEvent(routineId: string) {
    // 停止重复提醒
    this.removeEventNotification(routineId);
    
    // 调用回调
    if (this.onStartEvent) {
      this.onStartEvent(routineId);
    }
  }

  // 处理Snooze
  handleSnooze(routineId: string, minutes: number) {
    const timer = this.timers.get(routineId);
    if (!timer) return;

    // 标记为snoozed
    timer.isSnoozed = true;
    timer.snoozeEndTime = Date.now() + minutes * 60000;

    // 设置snooze定时器
    timer.snoozeTimerId = setTimeout(() => {
      timer.isSnoozed = false;
      timer.snoozeEndTime = undefined;
      // Snooze结束后重新开始重复提醒
      this.startRepeatingNotification(timer.routine);
    }, minutes * 60000) as any;
  }

  // 获取snooze状态
  getSnoozeStatus(routineId: string): { isSnoozed: boolean; remainingTime?: number } {
    const timer = this.timers.get(routineId);
    if (!timer || !timer.isSnoozed) {
      return { isSnoozed: false };
    }

    const remainingTime = timer.snoozeEndTime ? Math.max(0, timer.snoozeEndTime - Date.now()) : 0;
    return {
      isSnoozed: true,
      remainingTime: Math.ceil(remainingTime / 60000) // 转换为分钟
    };
  }

  // 获取所有定时器状态
  getAllTimers(): NotificationTimer[] {
    return Array.from(this.timers.values());
  }
}

// 创建全局实例
export const notificationService = new NotificationService();

// 为Electron添加类型声明
declare global {
  interface Window {
    electronAPI?: {
      focusWindow: () => void;
    };
  }
} 