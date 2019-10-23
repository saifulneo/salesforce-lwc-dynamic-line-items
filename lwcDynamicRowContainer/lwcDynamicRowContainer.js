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