import DomainEvent from 'src/Common/Domain/DomainEvent';
import Entity from 'src/Common/Domain/Entity';

export default abstract class AggregateRoot extends Entity {
  private events: Set<DomainEvent<any>> = new Set();

  protected addEvent(event: DomainEvent<any>): void {
    this.events.add(event);
  }
  public clearEvent(): void {
    this.events.clear();
  }
  public getEvents(): Set<DomainEvent<any>> {
    return this.events;
  }
}
