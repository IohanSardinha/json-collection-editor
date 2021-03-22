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

function applyConfigToLabel(label, object, field, config, collectionName){
    let fieldConfig = config[collectionName].object[field];
    if(fieldConfig)
    {
        if(fieldConfig.hide)
            label.hidden = true;
        if(fieldConfig.type){
            if(fieldConfig.type === "enum" && fieldConfig.enum && config.enums && config.enums[fieldConfig.enum])
            {
                label.innerHTML = "";
                label.append(document.createTextNode(config.enums[fieldConfig.enum][object[field]]));  
                if(fieldConfig.enumColor){
                    label.style.color = fieldConfig.enumColor[object[field]];
                    console.log(fieldConfig.enumColor[object[field]]);
                }
                if(config.enums[fieldConfig.enum][object[field]] == "")
                    label.hidden = true;
            }
        }
    }
}


function newListItem(index, object, config, collectionName) {
    let item = document.createElement("div");
    item.className = "border bg-light border-primary rounded mt-2 p-2";
        
    let i = 0;
    for(let field in object){
        if(i == 0){
            let title = document.createElement('h6');
            title.appendChild(document.createTextNode(object[field]));
            applyConfigToLabel(title, object, field, config, collectionName);
            item.appendChild(title);
        }
        else{
            let label = document.createElement('label');
            label.appendChild(document.createTextNode(object[field]));
            label.className = "border rounded pb-1 pt-1 ps-2 pe-2 me-2";
            applyConfigToLabel(label, object, field, config, collectionName);
            item.appendChild(label);
        }
        
        i++;
    }
    

    
    let editButton = document.createElement('a');
    editButton.appendChild(document.createTextNode('Edit'));
    editButton.href = "editor.html?file="+config[collectionName].fileName+"&index="+index;
    editButton.className = "btn btn-outline-warning ms-2 me-2";
    item.appendChild(editButton);
    
    let deleteButton = document.createElement('button');
    deleteButton.appendChild(document.createTextNode('Delete'));
    deleteButton.className = "btn btn-outline-danger";
    item.appendChild(deleteButton);
        
    item.id = collectionName+"Item"+index;
    
    return item;
    
}

function parseJson(json, config){
    let list_container = document.getElementById('list_container');
    
    let collectionName = Object.keys(json)[0];
    
    let collection_title = document.getElementById('collection_title');
    collection_title.appendChild(document.createTextNode(camelToTitleCase(collectionName)));
    
    let collection = json[collectionName];
    for(let i in collection){
        list_container.appendChild(newListItem(i, collection[i], config, collectionName));
    }
}

function loadConfig(){
     fetch('config.json')
        .then(response => response.json())
        .then(jsonResponse => loadJson(jsonResponse));
}

function loadJson(config){
    let url = new URL(window.location.href);

    if(url.searchParams.get('file')){
        fetch(url.searchParams.get('file'))
            .then(response => response.json())
            .then(jsonResponse => parseJson(jsonResponse));
    }
    else{
        fetch(config.mainFile)
            .then(response => response.json())
            .then(jsonResponse => parseJson(jsonResponse, config));
    }
}

document.addEventListener('DOMContentLoaded', loadConfig);