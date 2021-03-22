function camelToTitleCase(string){
    let newString = string[0].toUpperCase();
    for(let char of string.substr(1)){
        if(char == char.toUpperCase())
            newString += " "+char;
        else
            newString += char;
    }
    return newString;
}


function newListItem(object) {
    let item = document.createElement("div");
    item.className = "border border-primary rounded mt-2 p-2";
        
    let i = 0;
    for(let field in object){
        if(i == 0){
            let title = document.createElement('h6');
            title.appendChild(document.createTextNode(object[field]));
            item.appendChild(title)
        }
        else{
            item.appendChild(document.createTextNode(object[field] + "  |  "));
        }
        
        i++;    
        /*let label = document.createElement('h6');
        label.appendChild(document.createTextNode(camelToTitleCase(field)));
        let input = document.createElement('input');
        input.placeholder = object[field];
        
        item.appendChild(label);
        item.appendChild(input);*/
        
    }
    
    let editButton = document.createElement('a');
    editButton.appendChild(document.createTextNode('Edit'));
    editButton.href = "#";
    editButton.className = "btn btn-outline-warning ms-2 me-2";
    item.appendChild(editButton);
    
    let deleteButton = document.createElement('button');
    deleteButton.appendChild(document.createTextNode('Delete'));
    deleteButton.className = "btn btn-outline-danger";
    item.appendChild(deleteButton);
    
    return item;
    
}

function parseJson(json){
    let list_container = document.getElementById('list_container');
    
    let collectionName = Object.keys(json)[0];
    
    let collection_title = document.getElementById('collection_title');
    collection_title.appendChild(document.createTextNode(camelToTitleCase(collectionName)));
    
    let collection = json[collectionName];
    for(let i in collection){
        list_container.appendChild(newListItem(collection[i]));
    }
}

function loadJson(){
    let url = new URL(window.location.href);

    console.log(url.searchParams.get('index'));
    
    fetch('animals.json')
        .then(response => response.json())
        .then(jsonResponse => parseJson(jsonResponse));
}

document.addEventListener('DOMContentLoaded', loadJson);