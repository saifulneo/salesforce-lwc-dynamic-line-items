/* eslint-disable no-console */
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