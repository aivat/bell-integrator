<template>
  <div class="action-history">
    <ul class="action-history__list">
      <li
        class="action-history__item "
        v-for="(item, index) in filtertedEmployees"
        :key="index"
      >
        <div class="action-history__name action-history__item_padding">
          {{ item.employee.id }} {{ item.employee.name }}
        </div>
        <div class="action-history__action-type action-history__item_padding">
          {{ getActionType(item.type) }}
        </div>
        <div class="action-history__date action-history__item_padding">
          {{ item.date }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import store from "@/store/modules/employees";
import { IEmployee, ActionType } from "@/store/modules/employees";

@Component
export default class ActionHistory extends Vue {
  @Prop({ required: false, type: Number, default: ActionType.NONE }) private readonly actionType!: ActionType;

  store = getModule(store, this.$store);

  get filtertedEmployees() {
    return this.store.filtertedActionHistory(this.actionType);
  }

  get error(): string {
    return this.$store.state.employees.error;
  }

  getActionType(actionType: ActionType): string {
    if (actionType === ActionType.RESTORE) {
      return "Восстановили";
    }

    if (actionType === ActionType.DISMISS) {
      return "Уволили";
    }

    return "";
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

.action-history__item {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  border: 1px solid #2c3e50;
  border-radius: 4px;
}

.action-history__action-type {
  font-weight: 600;
  background: #f3f5f6;
}

.action-history__item_padding {
  padding: 6px 12px;
}

@media (min-width: 768px) {
  .action-history__item {
    flex-direction: row;
  }

  .action-history__action-type {
    margin: 0 10px;
  }
}
</style>