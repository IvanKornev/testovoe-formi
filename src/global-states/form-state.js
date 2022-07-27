import { makeAutoObservable } from 'mobx';

import { DoublyLinkedList } from '@data-structures';
import { LinkedListConverter } from '@lib/converters';
import { initialValues } from '@constants';
import { saveForm } from '@api';
import { createField, removeField, changeField, copyField } from '@entities';

class FormGlobalState {
  fieldsList = new DoublyLinkedList();

  titleField = initialValues.titleField;

  selectedField = null;

  fieldsCounter = 0;

  constructor() {
    makeAutoObservable(this);
  }

  selectField(value) {
    this.selectedField = value;
  }

  setFieldsCounter(value = 0) {
    this.fieldsCounter = value;
  }

  createField(values) {
    createField(values, this.fieldsList);
    this.setFieldsCounter((this.fieldsCounter += 1));
  }

  removeField() {
    const id = this.selectedField.uniqueId;
    const neighboringField = removeField(id, this.fieldsList);
    this.selectField(neighboringField);
    this.setFieldsCounter((this.fieldsCounter -= 1));
  }

  changeField(id, values) {
    changeField(id, values, this.fieldsList);
    this.selectField(null);
  }

  changeTitleField(values) {
    this.titleField = values;
  }

  copyField() {
    const id = this.selectedField.uniqueId;
    const results = copyField(id, this.fieldsList);
    this.selectField(results.copiedValue);
    this.setFieldsCounter((this.fieldsCounter += 1));
  }

  async save() {
    const savingData = {
      title: { ...this.titleField },
      fields: LinkedListConverter.toArray(this.fieldsList),
    };
    await saveForm(savingData);
  }

  reset() {
    this.selectField(null);
    this.fieldsList = new DoublyLinkedList();
    this.setFieldsCounter();
  }
}

export const formState = new FormGlobalState();
