# salesforce-lwc-dynamic-line-items
## Salesforce Lightning Web Component - Dynamic Line Items

Salesforce ecosystem is catching up with the modern web technologies, and if you are a developer then you are already aware of Lightning Web Components (LWC). If you left behind and don’t know much about Lightning Web Component (LWC) then go to the trailhead and learn about it.

Today I am going to introduce you to a new mechanism of how we can create dynamic line items in Salesforce Lightning Web Component. Sometimes we need to develop a complex UI to insert multiple object records. The backend part is easy but maintaining the front end UI to add and delete multiple line items without refreshing the window becomes very difficult to code. So I created a component where you will see the adding dynamic line items are easier and also you can delete the lines very easily.

This is how our final UI will look like.

https://www.youtube.com/watch?v=N3LlreSDkpo

[![VIDEO](https://img.youtube.com/vi/N3LlreSDkpo/0.jpg)](https://www.youtube.com/watch?v=N3LlreSDkpo)


The whole mechanism is divided into five supporting components.
LwcDynamicRowContainer
LwcObjectDynamicRow
LwcObjectLookup
LwcObjectLookupSearchComponent
LwcObjectLookupRecordList

lwcObjectLookupController class is also required for LwcObjectLookup.

### Step 1: Create a Lightning Web Component named as ‘LwcObjectLookupSearchComponent’.

The component folder contains two supporting files:

a. LwcObjectLookupSearchComponent.html
b. LwcObjectLookupSearchComponent.js

#### LwcObjectLookupSearchComponent.html
```
<template>
        <div class="slds-grid slds-wrap">
            <div class="slds-col slds-size_4-of-4">
                <div>
                    <lightning-input variant="label-hidden" 
                        label="Search Record" value={searchKey} type="search"
                        onchange={handleChange} placeholder="type text here">
                    </lightning-input>
                </div>
            </div>
        </div>
    </template>
```

#### LwcObjectLookupSearchComponent.js
```
import { LightningElement, track } from 'lwc';

export default class LwcObjectLookupSearchComponent extends LightningElement {
    
    @track searchKey;
    handleChange(event){

        const searchKey = event.target.value;

        event.preventDefault();
        const searchEvent = new CustomEvent(
            'change', 
            { 
                detail : searchKey
            }
        );
        this.dispatchEvent(searchEvent);
    }
}
```

### Step 2: Create a Lightning Web Component named as ‘LwcObjectLookupRecordList’.

The component folder contains three supporting files:

a. LwcObjectLookupRecordList.html
b. LwcObjectLookupRecordList.js
c. LwcObjectLookupRecordList.css  (you need to create it manually)

#### LwcObjectLookupRecordList.html
```
<template>
    <div >
        <div class="slds-grid slds-wrap slds-dropdown_length-with-icon-7 slds-dropdown_fluid slds-p-left_small">
                <div class="slds-col slds-size_12-of-12">
                    <ul class="slds-listbox slds-listbox_vertical" role="presentation">
                        <li role="presentation" class="slds-listbox__item">
                            <div class="slds-media slds-listbox__option 
                                                        slds-listbox__option_entity 
                                                        slds-listbox__option_has-meta" 
                                                        role="option"
                                onclick={handleSelect}>
                                <span class="slds-media__figure slds-listbox__option-icon">
                                    <lightning-icon icon-name={iconname} size="small"></lightning-icon>
                                </span>
                                <span class="slds-media__body">
                                    <span class="slds-listbox__option-text slds-listbox__option-text_entity">
                                        {record.Name}
                                    </span>
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
        </div>
    </div>
</template>
```
#### LwcObjectLookupRecordList.js
```
import { LightningElement, api } from 'lwc';

export default class LwcObjectLookupRecordList extends LightningElement {
    @api record;
    @api fieldname;
    @api iconname;

    handleSelect(event){
        event.preventDefault();
        const selectedRecord = new CustomEvent(
            "select",
            {
                detail : this.record.Id
            }
        );

        this.dispatchEvent(selectedRecord);
    } 
}
```

#### LwcObjectLookupRecordList.css
```
.slds-p-around_x-small{padding:0}
.slds-p-around--x-small{padding:0}

.slds-listbox_vertical .slds-listbox__option_entity, 
.slds-listbox_vertical .slds-listbox__option--entity, 
.slds-listbox--vertical .slds-listbox__option_entity, 
.slds-listbox--vertical .slds-listbox__option--entity{background-color:#fff}

.slds-listbox_vertical .slds-listbox__option_entity:hover, 
.slds-listbox_vertical .slds-listbox__option--entity:hover, 
.slds-listbox--vertical .slds-listbox__option_entity:hover, 
.slds-listbox--vertical .slds-listbox__option--entity{background-color:#fafafa}

.slds-p-left_small, .slds-p-left--small{padding-left:0}
.slds-p-left_small:first-child, .slds-p-left--small:first-child{margin-top:-1px;border:1px solid #ebebeb}

.slds-listbox_vertical .slds-listbox__option_entity, 
.slds-listbox_vertical .slds-listbox__option--entity, 
.slds-listbox--vertical .slds-listbox__option_entity, 
.slds-listbox--vertical .slds-listbox__option--entity{padding:10px 0 0 0}
```

### Step 3: Create a Lightning Web Component named as ‘lwcObjectLookup’ and also create an APEX controller class named as ‘lwcObjectLookupController’.

The component folder contains two supporting files:
lwcObjectLookup.html
lwcObjectLookup.js


#### lwcObjectLookup.html

```<template>
       <template if:false={selectedRecord}>
           <div >
               <c-lwc-project-lookup-search-component
                   onchange={handleOnchange}></c-lwc-project-lookup-search-component>
           </div>
       </template>
       <div >
           <template if:true={error}>
               <template if:true={error.details}>
                   <template if:true={error.details.body}>
                       {error.details.body.message}
                   </template>
               </template>
           </template>
       </div>
       <div>
           <template if:false={selectedRecord}>
               <template if:true={records}>
                   <template for:each={records} for:item="record">
 
                       <c-lwc-project-lookup-record-list key={record.Id} record={record}
                           onselect={handleSelect} iconname={iconname}
                           fieldname={searchfield}></c-lwc-project-lookup-record-list>
                   </template>
               </template>
           </template>
           <template if:false={selectedRecord}>
           </template>
       </div>
       <div>
           <template if:true={selectedRecord}>
               <div class="slds-combobox__form-element slds-input-has-icon
                               slds-input-has-icon_left-right" role="none">
                       <span class="slds-icon_container
                                   slds-icon-standard-account
                                   slds-combobox__input-entity-icon" title="Account">
                           <lightning-icon icon-name={iconname} ></lightning-icon>
                       </span>
                       <input class="slds-input slds-combobox__input
                              slds-combobox__input-value"
                              id="combobox-id-5" aria-controls="listbox-id-5"
                              autocomplete="off" role="textbox" type="text"
                              placeholder="Select an Option" readonly=""
                              value={selectedRecord.Name}
                              disabled
                             />
 
                       <button class="sicon_container slds-button slds-button_icon
                                      slds-input__icon slds-input__icon_right"
                               title="Remove selected option"
                               onclick={handleRemove}>
                           <lightning-icon icon-name="utility:close" size="small" style="margin-top: -4px; margin-right: 0px;"></lightning-icon>
                       </button>
                   </div>
           </template>
       </div>
   </template>
```


#### lwcObjectLookup.js
```/* eslint-disable no-console */
import { LightningElement, track, api } from 'lwc';
import findRecords from '@salesforce/apex/lwcObjectLookupController.findRecords';
export default class LwcObjectLookup extends LightningElement {
   @track records;
   @track error;
   @track selectedRecord;
   @api index;
   @api relationshipfield;
   @api iconname = "standard:account";
   @api objectName = 'Account';
   @api searchfield = 'Name';
   @api defaultItem;
   connectedCallback(){
 
       if(this.defaultItem!==undefined){
           this.selectedRecord = {Name: this.defaultItem.recordName, Id: this.defaultItem.recordId};
           console.log('recordName-->',this.defaultItem.recordName);
       }
 
   }
 
   handleOnchange(event){
 
       var recordsList = [];
       const searchKey = event.detail.value;
 
       findRecords({
           searchKey : searchKey,
           objectName : this.objectName,
           searchField : this.searchfield
       })
       .then(result => {
 
 
           for(let i=0; i < result.length; i++){
               const rec = result[i];
               recordsList.push({Name: rec[this.searchfield], Id: rec.Id});
           }
           this.error = undefined;
 
 
           this.records = recordsList;
       })
       .catch(error => {
           this.error = error;
           this.records = undefined;
       });
   }
   handleSelect(event){
       const selectedRecordId = event.detail;
 
       this.selectedRecord = this.records.find( record => record.Id === selectedRecordId);
       const selectedRecordEvent = new CustomEvent(
           "selectedrec",
           {
               detail : { recordId : this.selectedRecord.Id, recordName : this.selectedRecord.Name}
           }
       );
       this.dispatchEvent(selectedRecordEvent);
   }
 
   handleRemove(event){
       event.preventDefault();
       this.selectedRecord = undefined;
       this.records = undefined;
       this.error = undefined;
 
       const selectedRecordEvent = new CustomEvent(
           "selectedrec",
           {
               detail : { recordId : undefined, recordName : undefined}
           }
       );
       this.dispatchEvent(selectedRecordEvent);
   }
 
}

```


### Step 4: Create a Lightning Web Component named as ‘lwcObjectDynamicRow‘.

The component folder contains three supporting files:
lwcObjectDynamicRow.html
lwcObjectDynamicRow.js
lwcObjectDynamicRow.css (you need to create it manually)

#### lwcObjectDynamicRow.html
```<template>
   <fieldset class="slds-form-element slds-form-element_compound">
       <div class="slds-form-element__control">
           <div class="slds-form-element__row">
               <div class="slds-size_10-of-12">
                   <div class="slds-form-element">
                   <div class="slds-form-element__control">
                       <c-lwc-object-lookup iconname="standard-account" object-name="Account" searchfield="Name" default-item={defaultItem} onselectedrec={handleLookupChange}></c-lwc-object-lookup>
                   </div>
                   </div>
               </div>
               <div class="slds-size_2-of-12">
                   <div class="slds-form-element">
                   <div class="slds-form-element__control">
                       <lightning-button-icon class="del_input button" onclick={handleDelete} icon-name="utility:close" alternative-text="close"></lightning-button-icon> &nbsp;
                       <lightning-button-icon class="del_input button" onclick={handleAdd} icon-name="utility:add" alternative-text="Add"></lightning-button-icon>
                   </div>
                   </div>
               </div>
 
           </div>
       </div>
   </fieldset>
</template>

```

#### lwcObjectDynamicRow.js
```/* eslint-disable no-console */
import { LightningElement, track, api } from 'lwc';
 
export default class LwcObjectDynamicRow extends LightningElement {
 
   @api index;
   @api recordId;
   @api recordName;
   @track defaultItem;
  
   connectedCallback(){
 
       console.log('defaultItem-->', this.recordName);
 
       if(this.recordName){
           this.defaultItem = {index: this.index, recordId: this.recordId, recordName: this.recordName};
       }
 
   }
 
   handleDelete(){
 
       this.dispatchEvent(new CustomEvent('deleterow', {detail: this.index}));
   }
 
   handleLookupChange(event){
 
       this.dispatchEvent(new CustomEvent('itemselected', {detail: {index: this.index, recordId: event.detail.recordId, recordName: event.detail.recordName}}));
 
   }
 
   handleAdd(){
      
       this.dispatchEvent(new CustomEvent('addrow'));
   }
 
 
}
```

#### lwcObjectDynamicRow.css
```
.slds-p-around_x-small {padding: 0px !important;}
```


### Step 5: Create a Lightning Web Component named as ‘lwcDynamicRowContainer’.

The component folder contains four supporting files:
lwcDynamicRowContainer.html
lwcDynamicRowContainer.js
lwcDynamicRowContainer.js-meta.xml


#### lwcDynamicRowContainer.html
```
<template>
  
   <article class="slds-card" style="width:800px; margin:30px auto;">
       <div class="slds-card__header slds-grid">
           <header class="slds-media slds-media_center slds-has-flexi-truncate">
               <div class="slds-media__figure">
                   <span class="slds-icon_container slds-icon-standard-account" title="account">
                   <svg class="slds-icon slds-icon_small" aria-hidden="true">
                       <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                   </svg>
                   <span class="slds-assistive-text">account</span>
                   </span>
               </div>
               <div class="slds-media__body">
                   <h2 class="slds-card__header-title">
                   <a href="javascript:void(0);" class="slds-card__header-link slds-truncate" title="Accounts">
                       <span>Lightning Web Component - Dynamic Line Items</span>
                   </a>
                   </h2>
               </div>
           </header>
 
       </div>
 
       <div class="slds-card__body slds-card__body_inner">
           <hr>
           <template for:each={lineItems} for:item='item'>
 
               <c-lwc-object-dynamic-row onitemselected={handleRowSelection} onaddrow={handleAdd} ondeleterow={handleRowDeletion} key={item.index} index={item.index} record-id={item.recordId} record-name={item.recordName}></c-lwc-object-dynamic-row>
                          
           </template>
 
       </div>
 
   </article>
 
</template>
```


#### lwcDynamicRowContainer.js

```
/* eslint-disable no-alert */
/* eslint-disable no-console */
import { LightningElement, track } from 'lwc';
 
export default class LwcDynamicRowContainer extends LightningElement {
 
   @track lineItems = [];
  
   connectedCallback(){
      
       this.lineItems.push({index: 0, recordId: undefined, recordName: undefined});
       this.lineItems.push({index: 1, recordId: undefined, recordName: undefined});
       this.lineItems.push({index: 2, recordId: "00111000000UH7cGAG", recordName: "Test Account"});
   }
 
   handleAdd(){
      
       this.lineItems.push({index: this.lineItems[this.lineItems.length-1].index+1, recordId: undefined, recordName: undefined});
   }
 
   handleRowDeletion(event){
 
       var index = this.getIndex(event.detail);
      
       if(this.lineItems.length>1)
           this.lineItems.splice(index, 1);
 
   }
 
   handleRowSelection(event){
 
       var index = this.getIndex(event.detail.index);
 
       this.lineItems[index] = {index: event.detail.index, recordId: event.detail.recordId, recordName: event.detail.recordName};
 
   }
 
   getIndex(index){
       var i = 0;
       var tempIndex = 0;
       this.lineItems.forEach(function(item){
           if(item.index===index){
               tempIndex = i;
           }
           i++;
       });
       return tempIndex;
   }
 
}
```

#### lwcDynamicRowContainer.js-meta.xml 
Update the existing meta-data file so that you can add this component anywhere you like.

```
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata" fqn="lwcDynamicRowContainer">
   <apiVersion>47.0</apiVersion>
   <isExposed>true</isExposed>
   <targets>
       <target>lightning__AppPage</target>
       <target>lightning__RecordPage</target>
       <target>lightning__HomePage</target>
       <target>lightningCommunity__Page</target>
       <target>lightningCommunity__Default</target>
   </targets>
</LightningComponentBundle>
```


Enjoy the components and let me know if you have question. You can also get the code in [GitHub](https://github.com/saifulneo/salesforce-lwc-dynamic-line-items)

