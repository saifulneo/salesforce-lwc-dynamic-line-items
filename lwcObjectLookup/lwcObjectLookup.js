/* eslint-disable no-console */
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