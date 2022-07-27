import { faker } from '@faker-js/faker';
import { DoublyLinkedList } from '@data-structures';
import { fillDoublyLinkedList } from '@lib/tests';

describe('Двусвязный список', () => {
  let list;
  beforeEach(() => {
    list = new DoublyLinkedList();
  });

  it('Добавляет несколько нод в список', () => {
    const uniqueId = faker.datatype.uuid();
    list.insert({ uniqueId });
    expect(list.head.value.uniqueId).toBe(uniqueId);
    expect(list.head.value.uniqueId).toBe(uniqueId);
  });

  it('Находит ноду по id среди десятка других', () => {
    const uniqueId = faker.datatype.uuid();
    fillDoublyLinkedList(uniqueId, list);
    const { node } = list.find(uniqueId);
    expect(node.value.uniqueId).toBe(uniqueId);
  });

  it('Возвращает нулевую позицию при ненахождении ноды', () => {
    expect(list.find(105).position).toBeNull();
  });

  it('Заменяет значение ноды, найденной по id', () => {
    const uniqueId = faker.datatype.uuid();
    const emails = {
      old: faker.internet.email(),
      new: faker.internet.email(),
    };

    list.insert({ uniqueId, email: emails.old });
    expect(list.head.value.email).toBe(emails.old);

    list.change(uniqueId, { email: emails.new });
    expect(list.head.value.email).toBe(emails.new);
  });

  it('Удаляет ноду по id', () => {
    const uniqueId = faker.datatype.uuid();
    fillDoublyLinkedList(uniqueId, list);

    expect(list.find(uniqueId).position).not.toBeNull();
    list.remove(uniqueId);
    expect(list.find(uniqueId).position).toBeNull();
  });

  it('Копирует первую ноду, делая её следующей в списке', () => {
    const email = faker.internet.email();
    const uniqueId = faker.datatype.uuid();
    list.insert({ uniqueId, email });
    list.copy(uniqueId);

    const tailId = faker.datatype.uuid();
    list.insert({ uniqueId: tailId });

    const copy = list.head.next;
    expect(copy.value.email).toBe(email);
    expect(list.tail.value.uniqueId).toBe(tailId);
  });

  it('Получается размер списка через атрибут', () => {
    const uniqueId = faker.datatype.uuid();
    list.insert({ uniqueId });

    let removingNode = null;
    for (let i = 0; i < 3; i += 1) {
      removingNode = list.copy(uniqueId).copiedValue;
    }
    expect(list.length).toBe(4);
    list.remove(removingNode.uniqueId);
    expect(list.length).toBe(3);
  });
});
