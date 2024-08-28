import DomainEvent from 'src/Common/Domain/DomainEvent';
import UUID4 from 'src/Common/Domain/UUID4';
import ValueObject from 'src/Common/Domain/ValueObject';

export default abstract class Entity {
  public id: ValueObject<string>;
  public concurrencySafeVersion: number = 1;

  public equals(entity: Entity): boolean {
    if (this === entity) {
      return true;
    }
    if (entity instanceof Entity && this.id === entity.id) {
      return true;
    }
    return false;
  }
}
