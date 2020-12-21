<template>
  <ul class="employee-list">
    <li
      class="employee-list__item"
      v-for="employee in employees"
      :key="employee.index"
    >
      <div class="employee-item__header">
        <div class="employee-item__inner">
          <span class="employee-item__number">{{ employee.id }}</span>
          <span class="employee-item__name">{{ employee.name }}</span>
        </div>
        <button
          class="employee-item__btn"
          @click="moveEmployee(employee)"
        >
          {{ btnLabel }}
        </button>
      </div>
      <ul class="employee-item__child">
        <li
          class="employee-child"
          v-for="item in employee.items"
          :key="item.index"
        >
          {{ item.name }}
        </li>
      </ul>
    </li> 
  </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IEmployee, ActionType } from "@/store/modules/employees";

@Component
export default class EmployeeList extends Vue {
  @Prop({ required: true, type: Array }) private readonly employees!: IEmployee[];
  @Prop({ required: false, type: Number, default: ActionType.NONE }) private readonly actionType!: ActionType;

  get btnLabel(): string
  {
    return this.actionType === ActionType.DISMISS ? '+' : '-';
  }

  moveEmployee(employee: IEmployee): void
  {
    this.$emit('moveEmployee', employee, this.actionType);
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0;
}

.employee-list__item {
  border: 1px solid #2c3e50;
  border-radius: 4px;
  margin-bottom: 10px;
}

.employee-list__item:last-child {
  margin-bottom: 0;
}

.employee-item__btn {
  width: 32px;
  height: 32px;
  text-align: center;
  font-size: 18px;
}

.employee-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f3f5f6;
  padding: 6px 12px;
  border-radius: 4px 4px 0 0;
}

.employee-item__inner {
  display: flex;
}

.employee-item__name {
  padding: 0 4px;
}

.employee-item__child {
  border-top: 1px solid #2c3e50;
  padding: 6px 12px;
}

.employee-child {
  padding: 2px 0;
}
</style>
