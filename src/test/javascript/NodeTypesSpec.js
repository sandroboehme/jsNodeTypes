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

describe('The Node Type Manager', function() {

	// The documentation about the spec format can be found here:
	// http://pivotal.github.com/jasmine/
	var defaultNTJsonURL = "src/defaultNT/defaultNT.json";
	
	function compareItemDefitions(actualItemDefinitions, expectedItemDefinitions){
		expect(actualItemDefinitions.autoCreated).toEqual(expectedItemDefinitions.autoCreated);
		expect(actualItemDefinitions.mandatory).toEqual(expectedItemDefinitions.mandatory);
		expect(actualItemDefinitions.protected).toEqual(expectedItemDefinitions.protected);
		expect(actualItemDefinitions.onParentVersion).toEqual(expectedItemDefinitions.onParentVersion);
	}
	
	function compareNodeTypeProperties(actualNodeType, expectedNodeType){
		expect(actualNodeType.mixin).toBe(expectedNodeType.mixin);
		expect(actualNodeType.orderableChildNodes).toBe(expectedNodeType.orderableChildNodes);
		expect(actualNodeType.declaredSupertypes).toEqual(expectedNodeType.declaredSupertypes);
	}
	
	function comparePropertyDefProperties(actualPropertyDefs, expectedPropertyDefs){
		expect(actualPropertyDefs.defaultValues).toEqual(expectedPropertyDefs.defaultValues);
		expect(actualPropertyDefs.valueConstraints).toEqual(expectedPropertyDefs.valueConstraints);
		expect(actualPropertyDefs.requiredType).toEqual(expectedPropertyDefs.requiredType);
		expect(actualPropertyDefs.multiple).toEqual(expectedPropertyDefs.multiple);
	}

	function compareChildNodeDefProperties(actualChildNodeDefs, expectedChildNodeDefs){
		expect(actualChildNodeDefs.allowsSameNameSiblings).toEqual(expectedChildNodeDefs.allowsSameNameSiblings);
		expect(actualChildNodeDefs.defaultPrimaryType).toEqual(expectedChildNodeDefs.defaultPrimaryType);
		expect(actualChildNodeDefs.requiredPrimaryTypes).toEqual(expectedChildNodeDefs.requiredPrimaryTypes);
	}

	it('returns the node type names.', function() {
		var settings = {
				"defaultNTJsonURL": defaultNTJsonURL,
				"nodeTypesJson" : {"n1" : {
				},"n2" : {
				},"n3" : {
				},"n4" : {
				}} 
		};
		var ntManager = new org.jcrbrowser.NodeTypeManager(settings);
		expect(ntManager.getNodeTypeNames()).toEqual(["n1","n2","n3","n4"]);
	});

	it('returns the specified node type.', function() {
		var settings = {
				"defaultNTJsonURL": defaultNTJsonURL,
				"nodeTypesJson" : {"aNodeType" : {
				}} 
		};
		var ntManager = new org.jcrbrowser.NodeTypeManager(settings);
		expect(ntManager.getNodeType("aNodeType")).toEqual(settings.nodeTypesJson["aNodeType"]);
	});
	
	describe('collects', function () {
		//var ntManager = new org.jcrbrowser.NodeTypeManager(settings);
		var ntManager;

		function createChildNodeDef(name){
			var defaultNT = ntManager.internalGetDefaultNodeType();
			var newChildNodeDef = {};
			for (var childNodeDefPropName in defaultNT.declaredChildNodeDefinitions[0]) {
				var childNodeDefPropValue = defaultNT.declaredChildNodeDefinitions[0][childNodeDefPropName];
				newChildNodeDef[childNodeDefPropName] = childNodeDefPropValue;
			}
			newChildNodeDef.name = name;
			return newChildNodeDef; 
		};

		function createPropertyDef(name){
			var defaultNT = ntManager.internalGetDefaultNodeType();
			var newPropDef = {};
			for (var propNodeDefPropName in defaultNT.declaredPropertyDefinitions[0]) {
				var propNodeDefPropValue = defaultNT.declaredPropertyDefinitions[0][propNodeDefPropName];
				newPropDef[propNodeDefPropName] = propNodeDefPropValue;
			}
			newPropDef.name = name;
			return newPropDef; 
		};
		
		describe('all child node definitions from the super types ', function () {
			
			it('with <getAllChildNodeDefinitions()>.', function() {
				var settings = {
						"defaultNTJsonURL": defaultNTJsonURL,
						"nodeTypesJson" : {"aNodeType" : {
							"declaredSupertypes" : [ "aParentNodeType", "aMixinParentNodeType" ],
							"declaredChildNodeDefinitions" : [{
									"name" : "childNodeDef1"
								},{
									"name" : "childNodeDef2"} 
								]
						},"aParentNodeType" : {
							"declaredSupertypes" : [ "aGrandParentNodeType" ],
							"declaredChildNodeDefinitions" : [{
									"name" : "childNodeDef3"
								},{
									"name" : "childNodeDef4"} 
								]
						},"aMixinParentNodeType" : {
							"declaredChildNodeDefinitions" : [{
									"name" : "childNodeDef5"
								},{
									"name" : "childNodeDef6"} 
								]
						},"aGrandParentNodeType" : {
							"declaredChildNodeDefinitions" : [{
									"name" : "childNodeDef7"
								},{
									"name" : "childNodeDef8"} 
								]
						},"nt:base" : {
							"declaredSupertypes" : []
						}} 
				};
				ntManager = new org.jcrbrowser.NodeTypeManager(settings);
				var expectedChildNodeDefs = [{ name : 'childNodeDef1' }, {name : 'childNodeDef2' }, { name : 'childNodeDef3' }, { name : 'childNodeDef4' }, { name : 'childNodeDef5' }, { name : 'childNodeDef6' }, { name : 'childNodeDef7' }, { name : 'childNodeDef8' }];
				var expectedChildNodeDefs = [createChildNodeDef('childNodeDef1'),createChildNodeDef('childNodeDef2'), createChildNodeDef('childNodeDef3'), createChildNodeDef('childNodeDef4'), createChildNodeDef('childNodeDef5'), createChildNodeDef('childNodeDef6'), createChildNodeDef('childNodeDef7'), createChildNodeDef('childNodeDef8')];
				var resultingChildNodeDefs = ntManager.getNodeType("aNodeType").getAllChildNodeDefinitions();
				sameArrayContent(expectedChildNodeDefs, resultingChildNodeDefs);
			});
			
			it('with <getAllChildNodeDefinitions()> but does not contain duplicate entries from the parents.', function() {
				var settings = {
						"defaultNTJsonURL": defaultNTJsonURL,
						"nodeTypesJson" : {"aNodeType" : {
							"declaredSupertypes" : [ "aParentNodeType" ],
							"declaredChildNodeDefinitions" : [{
									"name" : "childNodeDef1"
								},{
									"name" : "childNodeDef2"} 
								]
						},"aParentNodeType" : {
							"declaredChildNodeDefinitions" : [{
									"name" : "childNodeDef1"
								},{
									"name" : "childNodeDef2"} 
								]
						},"nt:base" : {
							"declaredSupertypes" : []
						}} 
				};
				ntManager = new org.jcrbrowser.NodeTypeManager(settings);
				var expectedChildNodeDefs = [ 'childNodeDef1', 'childNodeDef2'];
				var expectedChildNodeDefs = [createChildNodeDef('childNodeDef1'), createChildNodeDef('childNodeDef2')];
				var resultingChildNodeDefs = ntManager.getNodeType("aNodeType").getAllChildNodeDefinitions();
				sameArrayContent(expectedChildNodeDefs, resultingChildNodeDefs);
			});
			
			it('with <getAllChildNodeDefinitions()> but does not follow circular dependencies.', function() {
				var settings = {
						"defaultNTJsonURL": defaultNTJsonURL,
						"nodeTypesJson" : {"aNodeType" : {
							"declaredSupertypes" : [ "aParentNodeType", "aMixinParentNodeType" ],
							"declaredChildNodeDefinitions" : [{
									"name" : "childNodeDef1"
								},{
									"name" : "childNodeDef2"} 
								]
						},"aParentNodeType" : {
							"declaredChildNodeDefinitions" : [{
									"name" : "childNodeDef3"
								},{
									"name" : "childNodeDef4"} 
								]
						},"aMixinParentNodeType" : {
							//this creates a circular dependency
							"declaredSupertypes" : [ "aNodeType" ],
							"declaredChildNodeDefinitions" : [{
									"name" : "childNodeDef5"
								},{
									"name" : "childNodeDef6"} 
								]
						},"nt:base" : {
							"declaredSupertypes" : []
						}} 
				};
				ntManager = new org.jcrbrowser.NodeTypeManager(settings);
		
				var expectedChildNodeDefs = [createChildNodeDef('childNodeDef1'), createChildNodeDef('childNodeDef2'), createChildNodeDef('childNodeDef3'), createChildNodeDef('childNodeDef4'), createChildNodeDef('childNodeDef5'), createChildNodeDef('childNodeDef6') ];
	
				var resultingChildNodeDefs = ntManager.getNodeType("aNodeType").getAllChildNodeDefinitions();
				sameArrayContent(expectedChildNodeDefs, resultingChildNodeDefs);
			});
		});
	
		describe('all property definitions from the super types', function () {
			it('with <getAllPropertyDefinitions()>', function() {
				var settings = {
						"defaultNTJsonURL": defaultNTJsonURL,
						"nodeTypesJson" : {"aNodeType" : {
							"declaredSupertypes" : [ "aParentNodeType", "aMixinParentNodeType" ],
							"declaredPropertyDefinitions" : [{
									"name" : "propertyDef1"
								},{
									"name" : "propertyDef2"} 
								]
						},"aParentNodeType" : {
							"declaredSupertypes" : [ "aGrandParentNodeType" ],
							"declaredPropertyDefinitions" : [{
									"name" : "propertyDef3"
								},{
									"name" : "propertyDef4"} 
								]
						},"aMixinParentNodeType" : {
							"declaredPropertyDefinitions" : [{
									"name" : "propertyDef5"
								},{
									"name" : "propertyDef6"} 
								]
						},"aGrandParentNodeType" : {
							"declaredPropertyDefinitions" : [{
									"name" : "propertyDef7"
								},{
									"name" : "propertyDef8"} 
								]
						},"nt:base" : {
							"declaredSupertypes" : []
						}}
				};
				ntManager = new org.jcrbrowser.NodeTypeManager(settings);
				var expectedPropertyDefs = [createPropertyDef('propertyDef1'), createPropertyDef('propertyDef2'), createPropertyDef('propertyDef3'), createPropertyDef('propertyDef4'), createPropertyDef('propertyDef5'), createPropertyDef('propertyDef6'), createPropertyDef('propertyDef7'), createPropertyDef('propertyDef8') ];
				var resultingPropertyDefs = ntManager.getNodeType("aNodeType").getAllPropertyDefinitions();
				sameArrayContent(expectedPropertyDefs, resultingPropertyDefs);
			});
			
			it('with <getAllPropertyDefinitions()> but does not contain duplicate entries from the parents.', function() {
				var settings = {
						"defaultNTJsonURL": defaultNTJsonURL,
						"nodeTypesJson" : {"aNodeType" : {
							"declaredSupertypes" : [ "aParentNodeType" ],
							"declaredPropertyDefinitions" : [{
									"name" : "propertyDef1"
								},{
									"name" : "propertyDef2"} 
								]
						},"aParentNodeType" : {
							"declaredSupertypes" : [ "aGrandParentNodeType" ],
							"declaredPropertyDefinitions" : [{
								"name" : "propertyDef1"
							},{
								"name" : "propertyDef2"} 
								]
						},"aGrandParentNodeType" : {
							"declaredPropertyDefinitions" : [{
								"name" : "propertyDef1"
							},{
								"name" : "propertyDef2"} 
								]
						},"nt:base" : {
							"declaredSupertypes" : []
						}}
				};
				ntManager = new org.jcrbrowser.NodeTypeManager(settings);
				var expectedPropertyDefs = [createPropertyDef('propertyDef1'), createPropertyDef('propertyDef2') ];
				var resultingPropertyDefs = ntManager.getNodeType("aNodeType").getAllPropertyDefinitions();
				sameArrayContent(expectedPropertyDefs, resultingPropertyDefs);
			});
			
			it('with <getAllPropertyDefinitions()> but does not follow circular dependencies.', function() {
				var settings = {
						"defaultNTJsonURL": defaultNTJsonURL,
						"nodeTypesJson" : {"aNodeType" : {
							"declaredSupertypes" : [ "aParentNodeType", "aMixinParentNodeType" ],
							"declaredPropertyDefinitions" : [{
									"name" : "propertyDef1"
								},{
									"name" : "propertyDef2"} 
								]
						},"aParentNodeType" : {
							"declaredPropertyDefinitions" : [{
									"name" : "propertyDef3"
								},{
									"name" : "propertyDef4"} 
								]
						},"aMixinParentNodeType" : {
							// this supertype should not create a circular dependency
							"declaredSupertypes" : [ "aNodeType" ],
							"declaredPropertyDefinitions" : [{
									"name" : "propertyDef5"
								},{
									"name" : "propertyDef6"} 
								]
						},"nt:base" : {
							"declaredSupertypes" : []
						}}
				};
				ntManager = new org.jcrbrowser.NodeTypeManager(settings);
				var expectedPropertyDefs = [createPropertyDef('propertyDef1'), createPropertyDef('propertyDef2'), createPropertyDef('propertyDef3'), createPropertyDef('propertyDef4'), createPropertyDef('propertyDef5'), createPropertyDef('propertyDef6')];
				var resultingPropertyDefs = ntManager.getNodeType("aNodeType").getAllPropertyDefinitions();
				sameArrayContent(expectedPropertyDefs, resultingPropertyDefs);
			});

		});
	});
	
	describe('recognizes the default settings', function () {
		var settings = {
				"defaultNTJsonURL": defaultNTJsonURL,
				"nodeTypesJson" : {
					"nt": {
					    "declaredPropertyDefinitions": [{"name": "propertyDef1"}, {"name": "propertyDef2"}],
					    "declaredChildNodeDefinitions": [{"name": "childNodeDef1"}, {"name": "childNodeDef2"}],
					},
					"nt:base" : {
					}
				} 
		};
		var ntManager = new org.jcrbrowser.NodeTypeManager(settings);
		
		it('for the properties at the node type level', function() {
			compareNodeTypeProperties(ntManager.getNodeType("nt"), ntManager.internalGetDefaultNodeType())
		});
		
		describe('for the properties at the property definition level', function() {
			it('that do inherit from item definition', function() {
				comparePropertyDefProperties(ntManager.getNodeType("nt").getAllPropertyDefinitions(), ntManager.internalGetDefaultNodeType().declaredPropertyDefinitions);
			});
			it('that don\'t inherit from item definition', function() {
				compareItemDefitions(ntManager.getNodeType("nt").getAllPropertyDefinitions(), ntManager.internalGetDefaultNodeType().declaredPropertyDefinitions);
			});
		});
		
		describe('for the properties at the child node definition level', function() {
			ntManager = new org.jcrbrowser.NodeTypeManager(settings);
			it('that do inherit from item definition', function() {
				compareChildNodeDefProperties(ntManager.getNodeType("nt").getAllChildNodeDefinitions(), ntManager.internalGetDefaultNodeType().declaredChildNodeDefinitions);
			});
	        
			it('that don\'t inherit from item definition', function() {
				compareItemDefitions(ntManager.getNodeType("nt").getAllChildNodeDefinitions(), ntManager.internalGetDefaultNodeType().declaredChildNodeDefinitions);
			});
		});		
	});
	
	describe('overwrites the default settings', function () {
		var settings = {
				"defaultNTJsonURL": defaultNTJsonURL,
				"nodeTypesJson" : {
					"nt": {
					    "mixin": true,
					    "orderableChildNodes": true,
					    "declaredSupertypes": [
					      "otherNodeType"
					    ],
					    "declaredPropertyDefinitions": [
					      {
					        "defaultValues": "a default value",
					        "valueConstraints": ["banana","apple"],
					        "requiredType": "String",
					        "multiple": true,
					        
					        "autoCreated": true,
					        "mandatory": true,
					        "protected": true,
					        "onParentVersion": "VERSION"
					      }
					    ],
					    "declaredChildNodeDefinitions": [
					      {
					        "allowsSameNameSiblings": true,
					        "defaultPrimaryType": "otherNodeType",
					        "requiredPrimaryTypes": [
					          "otherNodeType"
					        ],
					        
					        "autoCreated": true,
					        "mandatory": true,
					        "protected": true,
					        "onParentVersion": "VERSION"
					      }
					    ]
					  },
					"nt:base" : {
					},
					"otherNodeType" : {
						
					}
			} 
		};
		var ntManager = new org.jcrbrowser.NodeTypeManager(settings);

		it('for the properties at the node type level', function() {
			compareNodeTypeProperties(ntManager.getNodeType("nt"), settings.nodeTypesJson.nt)
		});
		
		describe('for the properties at the property definition level', function() {
			it('that do inherit from item definition', function() {
				comparePropertyDefProperties(ntManager.getNodeType("nt").getAllPropertyDefinitions(), settings.nodeTypesJson.nt.declaredPropertyDefinitions);
			});
			it('that don\'t inherit from item definition', function() {
				compareItemDefitions(ntManager.getNodeType("nt").getAllPropertyDefinitions(), settings.nodeTypesJson.nt.declaredPropertyDefinitions);
			});
		});
		
		describe('for the properties at the child node definition level', function() {
			it('that do inherit from item definition', function() {
				compareChildNodeDefProperties(ntManager.getNodeType("nt").getAllChildNodeDefinitions(), settings.nodeTypesJson.nt.declaredChildNodeDefinitions);
			});
	        
			it('that don\'t inherit from item definition', function() {
				compareItemDefitions(ntManager.getNodeType("nt").getAllChildNodeDefinitions(), settings.nodeTypesJson.nt.declaredChildNodeDefinitions);
			});
		});			
	});

	function sameArrayContent(array1, array2){
		expect(array1.length).toBe(array2.length); 
		for (var i=0; i<array2.length; i++){
			expect(array1).toContain(array2[i]);
		}
	}

});
