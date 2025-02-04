import { AfterContentInit, Component, computed, DoCheck, effect, OnChanges, OnInit, signal, Signal, SimpleChanges, WritableSignal } from '@angular/core';
import { TableComponent } from "../components/table/table.component";
import { ButtonComponent } from "../components/button/button.component";
import { QualificationsCacheService } from '../services/qualifications-cache.service';
import { TableConfiguration } from '../components/table/table-configuration';
import { Qualification } from '../models/Qualification';
import { Label } from '../components/table/label';
import { SelectionBehaviour } from '../components/table/selection-behaviour';
import { Routing } from '../components/table/routing';
import { ActivatedRoute, RouterLink, UrlSegment } from '@angular/router';
import { TextFilterComponent } from "../components/text-filter/text-filter.component";
import { CheckboxComponent } from "../components/checkbox/checkbox.component";
import { QualificationFormComponent } from "../components/qualification-form/qualification-form.component";
import { EmployeesCacheService } from '../services/employees-cache.service';
import { Employee } from '../models/Employee';
import { QualificationFilterService } from '../services/qualification-filter.service';

@Component({
  selector: 'app-employee-add-qualification',
  standalone: true,
  imports: [TableComponent, ButtonComponent, TextFilterComponent, CheckboxComponent, QualificationFormComponent, RouterLink],
  templateUrl: './employee-add-qualification.component.html',
  styleUrl: './employee-add-qualification.component.css'
})
export class EmployeeAddQualificationComponent implements OnInit, DoCheck {
  qualificationData: Qualification = new Qualification();
  tableConfiguration!: TableConfiguration<Qualification>;
  displayData!: Signal<Qualification[]>;
  returnUrl!: string;
  id: string | undefined = undefined;
  private inUseSignal: WritableSignal<boolean> = signal(true); //By default, both checkboxes are checked (list all the entries)
  private unusedSignal: WritableSignal<boolean> = signal(true);
  private qualificationSearchWordSignal: WritableSignal<string> = signal("");
  test: Signal<Employee> = signal(new Employee());
  loaded = false;


  constructor(
    private route: ActivatedRoute,
    private qualificationsCache: QualificationsCacheService,
    private employeesCache: EmployeesCacheService,
    private qualificationsFilter: QualificationFilterService
  ) { }

  ngDoCheck(): void {
    if(this.loaded)
      return;
    let employee = this.employeesCache.read()().find(val => val.id == this.id as unknown as number);
    if(employee && this.id){
      // employee.qualifications?.forEach(val => this.qualificationsCache.addToSelected(this.returnUrl, val))
      this.qualificationsCache.notifyStateChange();
      this.loaded = true;
    }
  }

  ngOnInit(): void {
    this.qualificationsCache.refresh();
    this.employeesCache.refresh();
    this.setUrlDependendState();
    this.computeDisplayedData();
    this.configureTable();
  }

  private setUrlDependendState() {
    const currentUrl: UrlSegment[] = this.route.snapshot.url;
    this.returnUrl = currentUrl.filter((val, index, arr) => index != arr.length - 1).join("/");
    if (currentUrl[1].toString() == "edit") {
      this.id = currentUrl[2].toString();
    }
  }

  private computeDisplayedData() {
    this.displayData = computed<Qualification[]>(() => {
      this.qualificationsCache.detectStateChange(); 
      const qualificationSearchWord = this.qualificationSearchWordSignal();
      const inUse = this.inUseSignal();
      const unused = this.unusedSignal();
      const allQualifications: Qualification[] = this.qualificationsCache.read()();
      const allEmployees: Employee[] = this.employeesCache.read()();
      
      let finalResult: Qualification[] = this.qualificationsFilter.filterByUsagesCheckboxes(allQualifications, allEmployees, inUse, unused);
      if (qualificationSearchWord != "") {
        finalResult = this.qualificationsFilter.filterColumn(finalResult, 'skill', qualificationSearchWord);
      }
      return finalResult;
    });
  }

  public configureTable(): TableConfiguration<Qualification>{
    const labels: Label<Qualification>[] = [
      new Label("id", "ID"),
      new Label("skill", "Qualification"),
    ];
    const selectionBehaviour: SelectionBehaviour = new SelectionBehaviour(true, this.returnUrl);
    const routing: Routing = new Routing(false);
    return  new TableConfiguration(
      this.qualificationsCache,
      labels,
      false,
      selectionBehaviour,
      routing
    );
  }

  handleEventUnusedCheckbox($event: { check: boolean; }) {
    this.unusedSignal.set($event.check);
  }

  handleEventInUseCheckbox($event: { check: boolean; }) {
    this.inUseSignal.set($event.check);
  }

  handleEventFilterByQualification($event: { value: string; }) {
    this.qualificationSearchWordSignal.set($event.value);
  }

  updateQualificationData(qualification: Qualification) {
    this.qualificationData = qualification;
  }

  deleteSelectedData() {
    this.employeesCache.withdrawSelected(this.returnUrl);
  }

  submitQualification() {
    this.qualificationsCache.insert(this.qualificationData);
    this.qualificationData = new Qualification();
    this.qualificationsCache.notifyStateChange();
  }
}
