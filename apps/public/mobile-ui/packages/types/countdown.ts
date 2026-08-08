export interface GodCountDownProps {
  /**
   * 倒计时秒数
   */
  count: number | null,
  min?: number,
  onFinish?: null | ((time: number) => void),
  onClick?: null | (() => void),
  children: (time: number, formatTime: FormatTime) => React.ReactNode,
  format?: 'DD:HH:mm:ss' | 'HH:mm:ss' | 'mm:ss',
}

export type FormatTime = {
  /**
   * 秒转换成时间
   */
  formatTime: { day: number, hour: number, minute: number, second: number },
  /**
   * 格式化时间后的字符串 “20:59:59”
   */
  formatTimeString: string,
}

export type appState = "active" | "background" | "inactive" | "unknown" | "extension"
