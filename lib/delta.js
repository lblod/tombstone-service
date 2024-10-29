import flatten from 'lodash.flatten';

export class Delta {

  constructor(delta) {
    this.delta = delta;
  }

  get inserts() {
    return flatten(this.delta.map(changeSet => changeSet.inserts));
  }

  get deletes() {
    return flatten(this.delta.map(changeSet => changeSet.deletes));
  }
  getInsertsFor(predicate, object) {
    return this.inserts
      .filter(t => t.predicate.value === predicate && t.object.value === object)
      .map(t => t.subject.value);
  }
  getDeletesFor(predicate) {
    return this.deletes
      .filter(t => t.predicate.value === predicate)
      .map(t => { return { subject: t.subject.value, predicate: t.predicate.value, object: t.object.value } });
  }
}
