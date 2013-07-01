/*
* Copyright 2013 Sandro Boehme
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*   http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

// creating the namespace
var de = de || {};
de.sandroboehme = de.sandroboehme || {};
var sandroboehme = de.sandroboehme;
/*
 JSNodeTypes - The JavaScript Node Types library for Apache Sling

 The documentation of the library can be found at:
 http://www.jcrbrowser.org/sling/libs/jsnodetypes/content/documentation.html
 
*/

//defining the module
de.sandroboehme.NodeTypeManager = (function() {

	function NodeTypeManager(settingsParameter){
		// copies the setting parameters to the object scope and configures the defaults
		
		var noSettingsProvided = typeof settingsParameter === 'undefined' || settingsParameter == null;
		var contextPath = (noSettingsProvided || typeof settingsParameter.contextPath === 'undefined') ? '/' : settingsParameter.contextPath+"/";
		var defaultNTJsonURL = (noSettingsProvided || typeof settingsParameter.defaultNTJsonURL === 'undefined') ? contextPath+'/libs/jsnodetypes/js/defaultNT/defaultNT.json' : settingsParameter.defaultNTJsonURL;
		this.defaultNTJson = getJson(defaultNTJsonURL);
		this.nodeTypesJson = (noSettingsProvided || typeof settingsParameter.nodeTypesJson === 'undefined') ? getJson(contextPath+'libs/jsnodetypes/content/nodetypes.json') : settingsParameter.nodeTypesJson; 
	};
	
	function getJson(url){
		var result;
		var xhr = null;
	    if (window.XMLHttpRequest) {
	    	xhr = new XMLHttpRequest();
	    } else if (window.ActiveXObject) { // Older IE.
	    	xhr = new ActiveXObject("MSXML2.XMLHTTP.3.0");
	    }
		xhr.open("GET", url, false/*not async*/);
		xhr.onload = function (e) {
		  if (xhr.readyState === 4) {
		    if (xhr.status === 200) {
		    	result = JSON.parse(xhr.responseText);
		    } else {
		    	console.error(xhr.statusText);
		    }
		  }
		};
		xhr.onerror = function (e) {
		  console.error(xhr.statusText);
		};
		xhr.send(null);
		return result;
	}
	
	if (!Array.prototype.indexOf) {
	    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
	        "use strict";
	        if (this == null) {
	            throw new TypeError();
	        }
	        var t = Object(this);
	        var len = t.length >>> 0;
	        if (len === 0) {
	            return -1;
	        }
	        var n = 0;
	        if (arguments.length > 1) {
	            n = Number(arguments[1]);
	            if (n != n) { // shortcut for verifying if it's NaN
	                n = 0;
	            } else if (n != 0 && n != Infinity && n != -Infinity) {
	                n = (n > 0 || -1) * Math.floor(Math.abs(n));
	            }
	        }
	        if (n >= len) {
	            return -1;
	        }
	        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
	        for (; k < len; k++) {
	            if (k in t && t[k] === searchElement) {
	                return k;
	            }
	        }
	        return -1;
	    }
	}

	/*
	 * This function walks recursively through all parent node types and calls the proccessing function with the current node type
	 *  
	 * currentNodeType - the node type to retrieve the property defs from in this call 
	 * processingFunction - the function to call on every node type
	 * processedNodeTypes - is used to avoid cycles by checking if a node type has been processed already
	 */
	function processParentNodeTypes (currentNodeType, processingFunction, processedNodeTypes){
		var initialCall = typeof processedNodeTypes === 'undefined';
		if (initialCall){
			processedNodeTypes = [];
		}
		
		processingFunction(currentNodeType);

		processedNodeTypes.push(currentNodeType.name);
		
		for (var supertypeIndex in currentNodeType.declaredSupertypes) {
			newNodeTypeName = currentNodeType.declaredSupertypes[supertypeIndex];
			
			newNodeType = this.getNodeType(newNodeTypeName);
			
			var notProcessedYet = processedNodeTypes.indexOf(newNodeTypeName) < 0;
			if (notProcessedYet){
				processParentNodeTypes.call(this, newNodeType, processingFunction, processedNodeTypes);
			}
		}
	};
	
	/*
	 * Sets the value of all properties of defaultNT.json to the corresponding undefined properties of the specified node type.
	 * E.g. if nt.declaredChildNodeDefinitions[2].allowsSameNameSiblings is undefined it is set to testNodeType.declaredChildNodeDefinitions[0].allowsSameNameSiblings
	 */
	function setDefaults(nt){
		// node type defaults
		for(var propName in this.defaultNTJson){
			if (propName != "declaredPropertyDefinitions" && propName != "declaredChildNodeDefinitions"){
				setDefaultNTProps.call(this, propName);
			}
		}
		
		// property definition defaults
		for(var propName in this.defaultNTJson.declaredPropertyDefinitions[0]){
			/*
			 * Sets the default values from all this.defaultNTJson.declaredPropertyDefinitions[0] properties
			 * too all properties of all declaredPropertyDefinitions of 'nt'.
			 */
			for (var propDefIndex in nt.declaredPropertyDefinitions){
				setDefaultPropDefProps.call(this, propDefIndex, propName);
			}
		}
		// child node definition defaults	
		for(var propName in this.defaultNTJson.declaredChildNodeDefinitions[0]){
			/*
			 * Sets the default values from all this.defaultNTJson.declaredChildNodeDefinitions[0] properties
			 * too all properties of all declaredChildNodeDefinitions of 'nt'.
			 */
			for (var childNodeDefIndex in nt.declaredChildNodeDefinitions){
				setDefaultChildNodeDefProps.call(this, childNodeDefIndex, propName);
			}
		}
		
		function setDefaultNTProps(propName){
			if(typeof nt[propName] === "undefined") nt[propName] = this.defaultNTJson[propName]; 
		}
		
		function setDefaultPropDefProps(index, propName){
			if(typeof nt.declaredPropertyDefinitions[index][propName] === "undefined") nt.declaredPropertyDefinitions[index][propName] = this.defaultNTJson.declaredPropertyDefinitions[0][propName]; 
		}
		
		function setDefaultChildNodeDefProps(index, propName){
			if(typeof nt.declaredChildNodeDefinitions[index][propName] === "undefined") nt.declaredChildNodeDefinitions[index][propName] = this.defaultNTJson.declaredChildNodeDefinitions[0][propName]; 
		}
		
	};
	
	NodeTypeManager.prototype.internalGetDefaultNodeType = function() {
		return this.defaultNTJson;
	};
	
	NodeTypeManager.prototype.getNodeTypeNames = function(name) {
		var ntNames = [];
		for (var ntJson in this.nodeTypesJson) {
			ntNames.push(ntJson);
		}
		return ntNames;
	}
		
	NodeTypeManager.prototype.getNodeType = function(name) {
		if (typeof this.nodeTypesJson[name] === "undefined") {
			return null;
		};
		if (typeof this.nodeTypesJson[name].name === "undefined") {
			this.nodeTypesJson[name].name = name;
			var that = this;
			this.nodeTypesJson[name].getAllChildNodeDefinitions = function(){
				var allCollectedChildNodeDefs = [];
				var allCollectedChildNodeDefNames = [];
				processParentNodeTypes.call(that, that.nodeTypesJson[name], function(currentNodeType){
					for (var childNodeDefIndex in currentNodeType.declaredChildNodeDefinitions) {
						var childNodeDef = currentNodeType.declaredChildNodeDefinitions[childNodeDefIndex];
						var childNodeDefName = childNodeDef.name;
						// in case the child has the same child node definition as its parent (supertype)
						var notProcessedYet = allCollectedChildNodeDefNames.indexOf(childNodeDefName) < 0;
						if (notProcessedYet){
							allCollectedChildNodeDefNames.push(childNodeDefName);
							allCollectedChildNodeDefs.push(childNodeDef);
						}
					}
				}); 
				return allCollectedChildNodeDefs;
			};
			
			var that = this;
			this.nodeTypesJson[name].getAllPropertyDefinitions = function(){
				var allCollectedPropertyDefs = [];
				var allCollectedPropertyDefNames = [];
				processParentNodeTypes.call(that, that.nodeTypesJson[name], function(currentNodeType){
					for (var propertyDefIndex in currentNodeType.declaredPropertyDefinitions) {
						var propertyDef = currentNodeType.declaredPropertyDefinitions[propertyDefIndex];
						var propertyDefName = propertyDef.name;
						// in case the child has the same property definition as its parent (supertype)
						var notProcessedYet = allCollectedPropertyDefNames.indexOf(propertyDefName) < 0;
						if (notProcessedYet){
							allCollectedPropertyDefNames.push(propertyDefName);
							allCollectedPropertyDefs.push(propertyDef);
						}
					}
				}); 
				return allCollectedPropertyDefs;
			};
		};
		setDefaults.call(this, this.nodeTypesJson[name]);
		return this.nodeTypesJson[name];
	}
	
	return NodeTypeManager;
}());
