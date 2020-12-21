<template>
  <div class="home">
    <div class="loading" v-if="isLoading">Загружаем ...</div>
    <div class="error" v-else-if="error">
      <div>{{ error }}</div>
      <button @click="getEmployees">Попробовать еще раз</button>
    </div>
    <div class="employees container" v-else>
      <div class="employees__column employees__column_left">
        <span class="employees__label">Работники</span>
        <input class="input" type="text" v-model="search" />
        <EmployeeList
          :employees="filtertedEmployees"
          :actionType="actionType.DISMISS"
          @moveEmployee="moveEmployee"
        />
      </div>
      <div class="employees__column employees__column_right">
        <span class="employees__label employees__label_selected"
          >Уволенные работники</span
        >
        <div class="employees__count">{{ numberOfPeopleLaidOff }}</div>
        <EmployeeList
          v-if="laidOffWorkers.length"
          :employees="laidOffWorkers"
          :actionType="actionType.RESTORE"
          @moveEmployee="moveEmployee"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import store from "@/store/modules/employees";
import { IEmployee, ActionType } from "@/store/modules/employees";
import EmployeeList from "@/components/EmployeeList.vue";

@Component({
  components: {
    EmployeeList
  }
})
export default class Home extends Vue {
  store = getModule(store, this.$store);
  search = '';

  get error(): string {
    return this.$store.state.employees.error;
  }

  get isLoading(): boolean {
    return this.$store.state.employees.isLoading;
  }

  get actionType(): typeof ActionType {
    return ActionType;
  }

  get filtertedEmployees(): IEmployee[] {
    return this.store.filtertedEmployees(this.search);
  }

  get laidOffWorkers(): IEmployee[] {
    return this.store.laidOffWorkers;
  }

  get isLaidOffWorkersShown(): boolean {
    return !!this.laidOffWorkers.length;
  }

  get numberOfPeopleLaidOff(): number {
    return this.laidOffWorkers.length;
  }

  moveEmployee(employee: IEmployee, actionType: ActionType): void {
    actionType === ActionType.DISMISS ? this.dismissEmployee(employee) : this.restoreEmployee(employee);
  }

  dismissEmployee(employee: IEmployee): void {
    this.store.dismissEmployee(employee);
  }

  restoreEmployee(employee: IEmployee): void {
    this.store.restoreEmployee(employee);
  }

  getEmployees(): void {
    this.store.getEmployees();
  }

  created(): void {
    this.getEmployees();
  }
}
</script>

<style scoped>
.employees {
  display: flex;
  margin-left: 10px;
  overflow-x: scroll;
}

.employees__column {
  display: flex;
  flex-direction: column;
  width: 240px;
}

.employees__column_left {
  margin-right: 28px;
}

.employees__label {
  margin-bottom: 4px;
}

.employees__label_selected {
  min-width: 180px;
}

input,
.employees__count {
  box-sizing: border-box;
  height: 22px;
  margin: 0;
}

.error {
  color: red;
}

@media (min-width: 768px) {
  .employees {
    overflow-x: auto;
  }
}
</style>