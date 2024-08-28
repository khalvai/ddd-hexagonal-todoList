import { isIP } from 'net';
import Result from 'src/Common/Application/Result';
import ValueObject from 'src/Common/Domain/ValueObject';
import Notification from 'src/Common/Application/Notification';

export default class IP extends ValueObject<string> {
  public static INVALID_IP_ADDRESS = 'INVALID_IP_ADDRESS';

  public static fromInput(ip: string): Result<IP, Notification> {
    if (!isIP(ip)) {
      const notification = new Notification();
      notification.addError(IP.INVALID_IP_ADDRESS);
      return { ok: false, error: notification };
    }

    return { ok: true, value: new IP(ip) };
  }
  public static fromValid(ip: string): IP {
    return new IP(ip);
  }
}
