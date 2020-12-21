import Vue from 'vue';
import Vuex from 'vuex';
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import axios from 'axios';

Vue.use(Vuex);

export enum ActionType {
    NONE,
    RESTORE,
    DISMISS
}

interface IPerson {
    id: number;
    name: string;
}

export interface IEmployee extends IPerson {
    items: IPerson[];
}

export interface IEmployeeWithNumberOfMatches extends IEmployee {
    numberOfMatches: number;
}

interface IAction {
    employee: IPerson;
    type: ActionType;
    date: Date
}

@Module({
    name: 'employees'
})
export default class Employees extends VuexModule {
    private initialData: IEmployee[] = [];
    private laidOffWorkersIds: number[] = [];
    private actionHistory: IAction[] = [];
    private isLoading = false;
    private error = '';

    public get employees(): IEmployee[] {
        return this.initialData.filter(item => !this.laidOffWorkersIds.includes(item.id));
    }

    public get filtertedEmployees(): (search: string) => IEmployee[] {
        return (search: string) => {
            if (search.length === 0) {
                return this.employees;
            }

            const pattern = new RegExp(search, 'ig');

            let employees: IEmployeeWithNumberOfMatches[] = [];
            for (let index = 0; index < this.employees.length; index++) {
                const employeeItemsNamesStr = this.employees[index].items
                    .map(item => item.name)
                    .join();

                const namesStr = `${this.employees[index].name} ${employeeItemsNamesStr}`;
                let result = namesStr.match(pattern);

                if (result) {
                    employees.push({ ...this.employees[index], numberOfMatches: result.length })
                }
            }

            return employees.sort((a, b) => b.numberOfMatches - a.numberOfMatches);
        }
    }

    public get laidOffWorkers(): IEmployee[] {
        return this.initialData.filter(item => this.laidOffWorkersIds.includes(item.id));
    }

    public get filtertedActionHistory(): (actionType: ActionType) => IAction[] {
        return (actionType: ActionType) => {
            if (actionType === ActionType.NONE) {
                return this.actionHistory;
            }

            return this.actionHistory.filter(item => item.type === actionType);
        }
    }

    @Mutation
    private SET_INITIAL_DATA(initialData: IEmployee[]): void {
        this.initialData = [...initialData];
    }

    @Mutation
    private ADD_TO_IDS_OF_LAID_OFF_WORKERS(employeeId: number): void {
        this.laidOffWorkersIds.push(employeeId);
    }

    @Mutation
    private REMOVE_FROM_IDS_OF_LAID_OFF_WORKERS(employeeId: number): void {
        const laidOffWorkersIndex = this.laidOffWorkersIds.indexOf(employeeId);
        this.laidOffWorkersIds.splice(laidOffWorkersIndex, 1);
    }

    @Mutation
    private ADD_ACTION_HISTORY(action: IAction): void {
        this.actionHistory.push(action);
    }

    @Mutation
    private EDIT_IS_LOADING(value: boolean): void {
        this.isLoading = value;
    }

    @Mutation
    private EDIT_ERROR(value: string): void {
        this.error = value;
    }

    @Action
    public dismissEmployee(employee: IEmployee): void {
        this.context.commit('ADD_TO_IDS_OF_LAID_OFF_WORKERS', employee.id);
        this.context.commit('ADD_ACTION_HISTORY', { employee, type: ActionType.DISMISS, date: new Date() });
    }

    @Action
    public restoreEmployee(employee: IEmployee): void {
        this.context.commit('REMOVE_FROM_IDS_OF_LAID_OFF_WORKERS', employee.id);
        this.context.commit('ADD_ACTION_HISTORY', { employee, type: ActionType.RESTORE, date: new Date() });
    }

    @Action({ rawError: true })
    public getEmployees(): void {
        this.context.commit('EDIT_IS_LOADING', true);

        if (this.initialData.length) {
            this.context.commit('EDIT_IS_LOADING', false);

            return;
        }

        axios.get(`https://my-json-server.typicode.com/aivat/bell-integrator/friends`)
            .then(response => {
                this.context.commit('SET_INITIAL_DATA', response.data)
            })
            .catch(e => {
                this.context.commit('EDIT_ERROR', `Что-то пошло не так... ${e.toString()}`)
            })
            .finally(() => this.context.commit('EDIT_IS_LOADING', false));
    }
}