var objectIndexInCollection;
var fileName;
var collection;

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

function encodeForAjax(data) {
  return Object.keys(data).map(function(k){
    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
  }).join('&')
}

function warningButton(){
    document.getElementById("saveButton").className = "btn btn-warning position-fixed bottom-0 end-0 mb-3 me-5";
}

function saveButton(){
    let request = new XMLHttpRequest();

    request.open("GET", "saveJsonFile.php?"+encodeForAjax({collection:fileName, index:objectIndexInCollection, redirect:'editor.html', json:JSON.stringify(collection[objectIndexInCollection])}), true);

    request.onreadystatechange = () => {
        if( request.readyState==4 && request.status==200 ){
            if(request.responseText.trim() == 'success')
            {
                document.getElementById("saveButton").className = "btn btn-success position-fixed bottom-0 end-0 mb-3 me-5";
                window.location.replace('collection.html?'+encodeForAjax({file:fileName}));
            }
            else
            {
                document.getElementById("saveButton").className = "btn btn-danger position-fixed bottom-0 end-0 mb-3 me-5";
                alert("Something went wrong");
            }
        }
    };

    request.send();
}

function buildReferenceModal(referenceCollection, parentButton, key, config, pseudoConfig){
    let modal_body = document.getElementById("modal_body");
    modal_body.innerHTML = "";
    
    let modal_title = document.getElementById("modal_title");
    modal_title.innerHTML = "";
    modal_title.appendChild(document.createTextNode("Select Object"))
    
    let div = document.createElement("div");
    let button = document.createElement("button");
        
    button.className = "container btn btn-danger mb-2 ";
    button.setAttribute("data-bs-dismiss","modal");
        
    button.onclick = () => {
        parentButton.innerHTML = "";
        let nullValue = config.null || null;
        if(pseudoConfig)
            collection[objectIndexInCollection][pseudoConfig.listKey][key] = nullValue;
        else
            collection[objectIndexInCollection][key] = nullValue;
        
        warningButton();
    };
        
    button.appendChild(document.createTextNode("remove"));
    div.appendChild(button);
    modal_body.appendChild(div);

    
    for(let index in referenceCollection){
        let firstValue = Object.values(referenceCollection[index])[0];
        div = document.createElement("div");
        button = document.createElement("button");
        
        button.className = "container btn btn-secondary mb-2 ";
        button.setAttribute("data-bs-dismiss","modal");
        
        button.onclick = () => {
            parentButton.innerHTML = "";
            parentButton.appendChild(document.createTextNode(firstValue));
            if(pseudoConfig)
                collection[objectIndexInCollection][pseudoConfig.listKey][key] = parseInt(index);
            else
                collection[objectIndexInCollection][key] = parseInt(index);
            warningButton();
        };
        
        button.appendChild(document.createTextNode(firstValue));
        div.appendChild(button);
        modal_body.appendChild(div);
    }
}

function buildReferenceButton(referenceCollection ,value, button, key, config, pseudoConfig){
    button.style["text-align"] = "center";
    button.style["text-decoration"] = "none";
    
    if(collection[value]){
        let firstValue = Object.values(referenceCollection[value])[0];
        button.appendChild(document.createTextNode(firstValue));
    }
    
    button.setAttribute("data-bs-toggle","modal");
    button.setAttribute("data-bs-target","#referenceModal");
    
    button.onclick = () => buildReferenceModal(referenceCollection, button, key, config, pseudoConfig);

}

function buildList(input, key, value, config, collectionName, pseudoConfigInput){
    for(let index in value){
        let subitem = newInputField(index, value[index], config, collectionName, pseudoConfigInput);
        subitem.className = "border-bottom pt-1 pb-1 container row";

        let removeButton = document.createElement("a");
        removeButton.setAttribute("listIndex", index);
        removeButton.className = "btn btn-danger ms-2 col-lg-6";
        removeButton.style['width'] = "50px";
        removeButton.appendChild(document.createTextNode("✘"));
        removeButton.onclick = () =>{
            input.innerHTML = "";
             collection[objectIndexInCollection][key].splice(index,1);
            buildList(input, key, value, config, collectionName, pseudoConfigInput);
            warningButton();
        };
        subitem.appendChild(removeButton);
        input.appendChild(subitem)
    }

    let addButton = document.createElement("a");
    addButton.className = "container mt-1 btn btn-success";
    addButton.appendChild(document.createTextNode("+ new"));
    addButton.onclick = () =>{

        let subitem = newInputField(value.length , "", config, collectionName, pseudoConfigInput);
        subitem.className = "border-bottom pt-1 pb-1 container row";

        let removeButton = document.createElement("a");
        removeButton.className = "btn btn-danger ms-2 col-lg-6";
        removeButton.style['width'] = "50px";
        removeButton.appendChild(document.createTextNode("✘"));
        removeButton.onclick = () =>{
            input.innerHTML = "";
            collection[objectIndexInCollection][key].splice(value.length,1);
            buildList(input, key, value, config, collectionName, pseudoConfigInput)
        };
        subitem.appendChild(removeButton);
        input.insertBefore(subitem, input.children[input.children.length - 1]);
    };
    
    input.appendChild(addButton);
}

function newInputField(key, value, config, collectionName, pseudoConfig){
    let item = document.createElement("div");    

    item.className = "mb-3 ms-3 me-3 form-group";
    if(!pseudoConfig)
    {
        let label = document.createElement("label");
        label.className = "mb-1";
        label.appendChild(document.createTextNode(camelToTitleCase(key)));
        item.appendChild(label);
    }
    
    let attributeConfig = pseudoConfig || config[collectionName].object[key];
    if(attributeConfig && attributeConfig.type){
        let input;
        
        if(attributeConfig.type == "enum" && attributeConfig.enum && config.enums && config.enums[attributeConfig.enum]){
            
            input = document.createElement("select");
            for(let i in config.enums[attributeConfig.enum]){
                let option = document.createElement("option");
                option.appendChild(document.createTextNode(config.enums[attributeConfig.enum][i]));
                if(i == value)
                    option.selected = true;
                
                input.appendChild(option);
                
                input.onchange = () =>{
                    collection[objectIndexInCollection][key] = input.selectedIndex;  
                    warningButton();
                };
            }
            
        }
        else if(attributeConfig.type == "reference" && attributeConfig.reference){
            input = document.createElement('a');
            
            if(attributeConfig.reference == fileName){
                buildReferenceButton(collection, value, input, key, config, pseudoConfig);
                
            }else
            {
                fetch(attributeConfig.reference)
                    .then(response => response.json())
                    .then(jsonResponse => {
                        let collectionName = Object.keys(jsonResponse)[0];
                        buildReferenceButton(jsonResponse[collectionName], value, input, key, config, pseudoConfig);
                    });
            }

        }
        else if(attributeConfig.type == "list" && attributeConfig.list){
            input = document.createElement("div");
            input.className = "overflow-auto border rounded bg-body p-1";
            input.style["max-height"] = "150px";
            
            let pseudoConfigInput = {"type":attributeConfig.list, "listKey": key};
            
            if(attributeConfig.list == "reference" && attributeConfig.reference){
              pseudoConfigInput["reference"] = attributeConfig.reference;  
            }
            
            buildList(input, key, value, config, collectionName, pseudoConfigInput);
            
        }
        else{
            input = document.createElement("input");
            
            if(attributeConfig.type == "numeric"){
                input.type = 'number';
                input.onchange = () =>{
                    collection[objectIndexInCollection][key] = parseInt(input.value);  
                    warningButton();
                };
            }
            else{
                input.onchange = () =>{
                    collection[objectIndexInCollection][key] = input.value;  
                    warningButton();
                };
            }
            
            input.value = value;
            
            item.appendChild(input);
        }
        
        if(attributeConfig.type !== "list")
            input.className = "form-control  form-control-sm";
        if(pseudoConfig)
            input.className += " col";
        
        item.appendChild(input);
            
    }else{
        let input = document.createElement("input");
        input.className = "form-control form-control-sm";
        input.onchange = () =>{
            collection[objectIndexInCollection][key] = input.value;  
            warningButton();
        };
        input.value = value;
        item.appendChild(input);
    }

    return item;
}

function parseJson(json, config, index){
    let edit_container = document.getElementById('edit_container');
    
    let collectionName = Object.keys(json)[0];
      
    collection = json[collectionName];

    if(!collection[index]){
        alert('Object does not exist!');
        window.location.replace('collection.html');
    }
    else if (!config[collectionName] || !config[collectionName].object){
        alert('Collection not configured!');
        window.location.replace('collection.html');   
    }
    
    for(let field in collection[index]){
        edit_container.appendChild(newInputField(field, collection[index][field], config, collectionName));
    }
}

function loadConfig(){
     fetch('config.json')
        .then(response => response.json())
        .then(jsonResponse => loadJson(jsonResponse));
}

function loadJson(config){
    let url = new URL(window.location.href);

    if(!url.searchParams.get('file') || (!url.searchParams.get('index') && !url.searchParams.get('new'))){
        window.location.replace('collection.html');
    }
    fileName = url.searchParams.get('file');
    objectIndexInCollection = url.searchParams.get('index') || url.searchParams.get('new');
    fetch(fileName)
        .then(response => response.json())
        .then(jsonResponse => parseJson(jsonResponse,config , url.searchParams.get('index')));
}

document.addEventListener('DOMContentLoaded', loadConfig);