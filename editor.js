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

function newInputField(key, value, config, collectionName){
    let item = document.createElement("div");
    item.className = "mb-3 ms-5 me-5 form-group";
    
    let label = document.createElement("label");
    label.className = "mb-1";
    label.appendChild(document.createTextNode(camelToTitleCase(key)));
    item.appendChild(label);
    
    let attributeConfig = config[collectionName].object[key];
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
            }
        }
        else{
            input = document.createElement("input");
            
            if(attributeConfig.type == "numeric"){
                input.type = 'number';
            }
                
            input.value = value;
        }
        
        input.className = "form-control form-control-sm";
        item.appendChild(input);
            
    }else{
        let input = document.createElement("input");
        input.className = "form-control form-control-sm";
        input.value = value;
        item.appendChild(input);
    }

    return item;
}

function parseJson(json, config, index){
    let edit_container = document.getElementById('edit_container');
    
    let collectionName = Object.keys(json)[0];
      
    let collection = json[collectionName];

    if(!collection[index] || !config[collectionName] || !config[collectionName].object){
        alert('Invalid  object!');
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
    fetch(url.searchParams.get('file'))
        .then(response => response.json())
        .then(jsonResponse => parseJson(jsonResponse,config , url.searchParams.get('index')));
}

document.addEventListener('DOMContentLoaded', loadConfig);