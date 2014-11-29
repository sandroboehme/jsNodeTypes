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
		var ntManager = new de.sandroboehme.NodeTypeManager(settings);
		expect(ntManager.getNodeTypeNames()).toEqual(["n1","n2","n3","n4"]);
	});

	it('returns the specified node type.', function() {
		var settings = {
				"defaultNTJsonURL": defaultNTJsonURL,
				"nodeTypesJson" : {"aNodeType" : {
				}} 
		};
		var ntManager = new de.sandroboehme.NodeTypeManager(settings);
		expect(ntManager.getNodeType("aNodeType")).toEqual(settings.nodeTypesJson["aNodeType"]);
	});
	
	describe('collects', function () {
		//var ntManager = new de.sandroboehme.NodeTypeManager(settings);
		var ntManager;

		describe('all child node definitions from the super types ', function () {
			
			function arrayContainsCnDefWithName(array, cnDefName){
				var found = false;
				for (var i=0; i<array.length && found===false; i++){
					found = array[i].name === cnDefName;
				}
				return found;
			}
			
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
				ntManager = new de.sandroboehme.NodeTypeManager(settings);
				var resultingChildNodeDefs = ntManager.getNodeType("aNodeType").getAllChildNodeDefinitions();
				expect(resultingChildNodeDefs.length).toBe(8);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef1")).toBe(true);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef2")).toBe(true);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef3")).toBe(true);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef4")).toBe(true);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef5")).toBe(true);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef6")).toBe(true);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef7")).toBe(true);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef8")).toBe(true);
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
				ntManager = new de.sandroboehme.NodeTypeManager(settings);
				var resultingChildNodeDefs = ntManager.getNodeType("aNodeType").getAllChildNodeDefinitions();
				expect(resultingChildNodeDefs.length).toBe(2);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef1")).toBe(true);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef2")).toBe(true);
			});
			
			it('with <getAllChildNodeDefinitions()> and lists child node definitions with the same name but different content.', function() {
				var settings = {
						"defaultNTJsonURL": defaultNTJsonURL,
						"nodeTypesJson" : {"aNodeType" : {
							"declaredSupertypes" : [ "aParentNodeType" ],
							"declaredChildNodeDefinitions" : [{
									"name" : "childNodeDef1",
							        "requiredPrimaryTypes": [
							            "aNodeType"
		                            ],
								},{
									"name" : "childNodeDef2"
								} 
							]
						},"aParentNodeType" : {
							"declaredSupertypes" : [ "aGrandParentNodeType" ],
							"declaredChildNodeDefinitions" : [{
									"name" : "childNodeDef1"
								},{
									"name" : "childNodeDef2"
								} 
							]
						},"aGrandParentNodeType" : {
							"declaredChildNodeDefinitions" : [{
									"name" : "childNodeDef1"
								}
							]
						},"nt:base" : {
							"declaredSupertypes" : []
						}} 
				};
				ntManager = new de.sandroboehme.NodeTypeManager(settings);
				var resultingChildNodeDefs = ntManager.getNodeType("aNodeType").getAllChildNodeDefinitions();
				
				expect(resultingChildNodeDefs.length).toBe(3);
				
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef1")).toBe(true);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef2")).toBe(true);
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
				ntManager = new de.sandroboehme.NodeTypeManager(settings);
	
				var resultingChildNodeDefs = ntManager.getNodeType("aNodeType").getAllChildNodeDefinitions();
				expect(resultingChildNodeDefs.length).toBe(6);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef1")).toBe(true);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef2")).toBe(true);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef3")).toBe(true);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef4")).toBe(true);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef5")).toBe(true);
				expect(arrayContainsCnDefWithName(resultingChildNodeDefs, "childNodeDef6")).toBe(true);
			});
		});
	
		describe('all property definitions from the super types', function () {
			
			function arrayContainsPropDefWithName(array, propDefName){
				var found = false;
				for (var i=0; i<array.length && found===false; i++){
					found = array[i].name === propDefName;
				}
				return found;
			}
			
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
				ntManager = new de.sandroboehme.NodeTypeManager(settings);
				var resultingPropertyDefs = ntManager.getNodeType("aNodeType").getAllPropertyDefinitions();
				expect(resultingPropertyDefs.length).toBe(8);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef1")).toBe(true);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef2")).toBe(true);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef3")).toBe(true);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef4")).toBe(true);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef5")).toBe(true);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef6")).toBe(true);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef7")).toBe(true);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef8")).toBe(true);
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
				ntManager = new de.sandroboehme.NodeTypeManager(settings);
				var resultingPropertyDefs = ntManager.getNodeType("aNodeType").getAllPropertyDefinitions();
				expect(resultingPropertyDefs.length).toBe(2);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef1")).toBe(true);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef2")).toBe(true);
			});
			
			it('with <getAllPropertyDefinitions()>  and lists property definitions with the same name but different content.', function() {
				var settings = {
						"defaultNTJsonURL": defaultNTJsonURL,
						"nodeTypesJson" : {"aNodeType" : {
							"declaredSupertypes" : [ "aParentNodeType" ],
							"declaredPropertyDefinitions" : [{
								"name" : "propertyDef1",
								"multiple": true
								},{
								"name" : "propertyDef2",
								"multiple": true
								} 
							]
						},"aParentNodeType" : {
							"declaredSupertypes" : [ "aGrandParentNodeType" ],
							"declaredPropertyDefinitions" : [{
								"name" : "propertyDef1"
								},{
								"name" : "propertyDef2",
								"multiple": true
								} 
							]
						},"aGrandParentNodeType" : {
							"declaredSupertypes" : [ "aGrandGrandParentNodeType" ],
							"declaredPropertyDefinitions" : [{
								"name" : "propertyDef1",
						        "valueConstraints": [
						          "nt:versionHistory"
						        ],
								},{
								"name" : "propertyDef2",
								"multiple": true
								} 
							]
						},"aGrandGrandParentNodeType" : {
							"declaredPropertyDefinitions" : [{
								"name" : "propertyDef1",
								"defaultValues": [{
									"string": "nt:base",
									"type": "Name"
                                }],
								},{
								"name" : "propertyDef2",
								"multiple": true
								} 
							]
						},"nt:base" : {
							"declaredSupertypes" : []
						}}
				};
				ntManager = new de.sandroboehme.NodeTypeManager(settings);
				var resultingPropertyDefs = ntManager.getNodeType("aNodeType").getAllPropertyDefinitions();
				expect(resultingPropertyDefs.length).toBe(5);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef1")).toBe(true);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef2")).toBe(true);
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
				ntManager = new de.sandroboehme.NodeTypeManager(settings);
				var resultingPropertyDefs = ntManager.getNodeType("aNodeType").getAllPropertyDefinitions();
				expect(resultingPropertyDefs.length).toBe(6);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef1")).toBe(true);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef2")).toBe(true);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef3")).toBe(true);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef4")).toBe(true);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef5")).toBe(true);
				expect(arrayContainsPropDefWithName(resultingPropertyDefs, "propertyDef6")).toBe(true);
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
		var ntManager = new de.sandroboehme.NodeTypeManager(settings);
		
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
			ntManager = new de.sandroboehme.NodeTypeManager(settings);
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
		var ntManager = new de.sandroboehme.NodeTypeManager(settings);

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

	describe('returns in getApplicableChildNodeTypes()', function () {
		var settings = {
				"defaultNTJsonURL": defaultNTJsonURL,
				"nodeTypesJson" : {
					"nt:base" : {
					},
					"aSuperType" : {
					    "declaredChildNodeDefinitions": [
					     {
					    	 "requiredPrimaryTypes": [
					    	     "supCnDef1"
					    	 ],
					      	 "name" : "supCnDef1Name"
					      },
					      {
						     "requiredPrimaryTypes": [
	  					  		"supCnDef3",
						  		"supCnDef2"
						     ],
						     "name" : "*"
						  }
					    ]
					},
					"mix:supSupCnDef1" : {
					    "mixin": true
					},
					"mix:supSupCnDef2" : {
					    "mixin": true
					},
					"supCnDef1" : {
					    "declaredSupertypes": [
					  		"mix:supSupCnDef1",
					  		"mix:supSupCnDef2"
					  	]
					},
					"supCnDef1Sub1" : {
					    "declaredSupertypes": [
					  		"supCnDef1"
					  	]
					},
					"supCnDef1Sub11" : {
					    "declaredSupertypes": [
					  		"supCnDef1Sub1"
					  	]
					},
					"supCnDef2": {
					},
					"supCnDef2Sub1" : {
					    "declaredSupertypes": [
					  		"supCnDef2"
					  	]
					},
					"supCnDef2Sub11" : {
					    "declaredSupertypes": [
					  		"supCnDef2Sub1"
					  	]
					},
					"supCnDef3": {
					},
					"supCnDef3Def2" : {
					    "declaredSupertypes": [
					  		"supCnDef3",
					  		"supCnDef2"
					  	]
					},
					"aNodeType" : {
					    "declaredSupertypes": [
					        "aSuperType"
 					    ],
 					    "declaredChildNodeDefinitions": [
					     {
					    	 "requiredPrimaryTypes": [
					    	     "cnDef1"
					    	 ],
					      	 "name" : "cnDef1Name"
					      },
					      {
						     "requiredPrimaryTypes": [
						          "cnDef2"
						     ],
						     "name" : "cnDef2Name"
					      },
					      {
						     "requiredPrimaryTypes": [
						          "cnDef3"
						     ],
						     "name" : "*"
							  
					      },
					      {
						     "requiredPrimaryTypes": [
						          "cnDef4",
						          "cnDef5"
						     ],
						     "name" : "*"
					      }
					    ]
					},
					"cnDef1" : {
					},
					"cnDef2" : {
					},
					"cnDef2Sub1" : {
					    "declaredSupertypes": [
					        "cnDef2"
					  	]
					},
					"cnDef2Sub11" : {
					    "declaredSupertypes": [
					        "cnDef2Sub1"
					  	]
					},
					"cnDef2Sub2" : {
					    "declaredSupertypes": [
					        "cnDef2"
					  	]
					},
					"cnDef3" : {
					},
					"cnDef4" : {
					},
					"cnDef5" : {
					    "declaredSupertypes": [
					  		"cnDef2Sub2"
					  	]
					},
					"cnDef4Sub1" : {
					    "declaredSupertypes": [
					  		"cnDef4"
					  	]
					},
					"cnDef4Sub11" : {
					    "declaredSupertypes": [
					  		"cnDef4Sub1"
					  	]
					},
					"cnDef4Sub2" : {
					    "declaredSupertypes": [
					  		"cnDef4"
					  	]
					},
					"cnDef5Sub1" : {
					    "declaredSupertypes": [
					  		"cnDef5"
					  	]
					},
					"cnDef5Sub2" : {
					    "declaredSupertypes": [
					  		"cnDef5",
					  		"cnDef2Sub2"
					  	]
					},
					"cnDef45" : {
					    "declaredSupertypes": [
					  		"cnDef4Sub11",
					  		"cnDef5Sub2"
					  	]
					},
					"cnDef45Sub1" : {
					    "declaredSupertypes": [
					  		"cnDef45"
					  	]
					}
				}
		};

		var ntManager = new de.sandroboehme.NodeTypeManager(settings);
		var ntBase = ntManager.getNodeType("nt:base");
		var ntResidualChild = ntManager.getNodeType("ntResidualChild");

		var applicableCnTypes = ntManager.getNodeType("aNodeType").getApplicableChildNodeTypes();

		
		/* adding an keySize function to Object */
		if (typeof Object.keySize === "undefined") {
			Object.keySize = function(obj) {
			    var keySize = 0, key;
			    for (key in obj) {
			        if (obj.hasOwnProperty(key)) keySize++;
			    }
			    return keySize;
			};
		}
		
		it('all valid child node types', function() {
			expect(applicableCnTypes!=null).toBe(true);
			expect(applicableCnTypes).toBeDefined();
			
			expect(applicableCnTypes["cnDef1Name"]).toBeDefined();
			expect(Object.keySize(applicableCnTypes["cnDef1Name"])).toBe(1);
			expect(applicableCnTypes["cnDef1Name"]["cnDef1"]).toBeDefined();

			expect(applicableCnTypes["cnDef2Name"]).toBeDefined();
			expect(Object.keySize(applicableCnTypes["cnDef2Name"])).toBe(9);
			expect(applicableCnTypes["cnDef2Name"]["cnDef2"]).toBeDefined();
			expect(applicableCnTypes["cnDef2Name"]["cnDef2Sub1"]).toBeDefined();
			expect(applicableCnTypes["cnDef2Name"]["cnDef2Sub11"]).toBeDefined();
			expect(applicableCnTypes["cnDef2Name"]["cnDef2Sub2"]).toBeDefined();
			expect(applicableCnTypes["cnDef2Name"]["cnDef5"]).toBeDefined();
			expect(applicableCnTypes["cnDef2Name"]["cnDef5Sub1"]).toBeDefined();
			expect(applicableCnTypes["cnDef2Name"]["cnDef5Sub2"]).toBeDefined();
			expect(applicableCnTypes["cnDef2Name"]["cnDef45"]).toBeDefined();
			expect(applicableCnTypes["cnDef2Name"]["cnDef45Sub1"]).toBeDefined();
			
			expect(applicableCnTypes["*"]).toBeDefined();
			expect(Object.keySize(applicableCnTypes["*"])).toBe(15);
			expect(applicableCnTypes["*"]["supCnDef2"]).toBeDefined();
			expect(applicableCnTypes["*"]["supCnDef2Sub1"]).toBeDefined();
			expect(applicableCnTypes["*"]["supCnDef2Sub11"]).toBeDefined();
			expect(applicableCnTypes["*"]["supCnDef3"]).toBeDefined();
			expect(applicableCnTypes["*"]["supCnDef3Def2"]).toBeDefined();
			
			expect(applicableCnTypes["*"]["cnDef3"]).toBeDefined();

			expect(applicableCnTypes["*"]["cnDef4"]).toBeDefined();
			//The following three node types contain a cycle within multiple required primary types that should ba handled correctly.
			expect(applicableCnTypes["*"]["cnDef4Sub1"]).toBeDefined();
			expect(applicableCnTypes["*"]["cnDef4Sub11"]).toBeDefined();
			expect(applicableCnTypes["*"]["cnDef4Sub2"]).toBeDefined();
			
			// cnDef5Sub2, cnDef5 and cnDef2Sub2 contain a cycle. It spans over two child node definitions with the same name and
			// should be handled correctly
			expect(applicableCnTypes["*"]["cnDef5"]).toBeDefined();
			expect(applicableCnTypes["*"]["cnDef5Sub1"]).toBeDefined();
			expect(applicableCnTypes["*"]["cnDef5Sub2"]).toBeDefined();
			
			expect(applicableCnTypes["*"]["cnDef45"]).toBeDefined();
			expect(applicableCnTypes["*"]["cnDef45Sub1"]).toBeDefined();

			expect(applicableCnTypes["supCnDef1Name"]).toBeDefined();
			expect(Object.keySize(applicableCnTypes["supCnDef1Name"])).toBe(3);
			expect(applicableCnTypes["supCnDef1Name"]["supCnDef1Sub1"]).toBeDefined();
			expect(applicableCnTypes["supCnDef1Name"]["supCnDef1Sub11"]).toBeDefined();
		});
		
		it('all valid child node types with multiple requiredPrimaryTypes', function() {
			expect(applicableCnTypes["*"]["supCnDef2"]).toBeDefined();
			expect(applicableCnTypes["*"]["supCnDef2Sub1"]).toBeDefined();
			expect(applicableCnTypes["*"]["supCnDef2Sub11"]).toBeDefined();
			expect(applicableCnTypes["*"]["supCnDef3"]).toBeDefined();
			expect(applicableCnTypes["*"]["supCnDef3Def2"]).toBeDefined();
			
			expect(applicableCnTypes["*"]).toBeDefined();
			expect(applicableCnTypes["*"]["cnDef4"]).toBeDefined();
			//The following three node types contain a cycle within multiple required primary types that should ba handled correctly.
			expect(applicableCnTypes["*"]["cnDef4Sub1"]).toBeDefined();
			expect(applicableCnTypes["*"]["cnDef4Sub11"]).toBeDefined();
			expect(applicableCnTypes["*"]["cnDef4Sub2"]).toBeDefined();
			
			// cnDef5Sub2, cnDef5 and cnDef2Sub2 contain a cycle. It spans over two child node definitions with the same name and
			// should be handled correctly
			expect(applicableCnTypes["*"]["cnDef5"]).toBeDefined();
			expect(applicableCnTypes["*"]["cnDef5Sub1"]).toBeDefined();
			expect(applicableCnTypes["*"]["cnDef5Sub2"]).toBeDefined();
			
			expect(applicableCnTypes["*"]["cnDef45"]).toBeDefined();
			expect(applicableCnTypes["*"]["cnDef45Sub1"]).toBeDefined();
		});
		
		it('all valid super types\' child node types and its subtypes including multiple requiredPrimaryTypes', function() {
			expect(applicableCnTypes["supCnDef1Name"]).toBeDefined();
			expect(applicableCnTypes["supCnDef1Name"]["supCnDef1Sub1"]).toBeDefined();
			expect(applicableCnTypes["supCnDef1Name"]["supCnDef1Sub1"]).toBeDefined();
			expect(applicableCnTypes["supCnDef1Name"]["supCnDef1Sub11"]).toBeDefined();
			
			expect(applicableCnTypes["*"]["supCnDef2"]).toBeDefined();
			expect(applicableCnTypes["*"]["supCnDef2Sub1"]).toBeDefined();
			expect(applicableCnTypes["*"]["supCnDef2Sub11"]).toBeDefined();
			expect(applicableCnTypes["*"]["supCnDef3"]).toBeDefined();
			expect(applicableCnTypes["*"]["supCnDef3Def2"]).toBeDefined();

		});

	});

	describe('checks in canAddChildNode()', function () {

		var settings = {
				"defaultNTJsonURL": defaultNTJsonURL,
				"nodeTypesJson" : {
					"ntResidualChild": {
					    "declaredChildNodeDefinitions": [
					      {
					        "requiredPrimaryTypes": [
					          "nt:base"
					        ],
					    	"name" : "*"
					      }
					    ]
					  },
					"ntNonResidualChild": {
					    "declaredChildNodeDefinitions": [
					      {
					        "requiredPrimaryTypes": [
					          "nt:base"
					        ],
					    	"name" : "aChildNodeDef1"
					      }
					    ]
					  },
					"ntNonResidualProtectedChild": {
					    "declaredChildNodeDefinitions": [
					      {
					        "requiredPrimaryTypes": [
					          "nt:base"
					        ],
					    	"name" : "aChildNodeDef2",
					        "protected": true
					      }
					    ]
					  },
					"ntWithOtherChildNode": {
					    "declaredChildNodeDefinitions": [
					      {
					        "requiredPrimaryTypes": [
					          "otherNodeType", "unknownNodeType"
					        ],
					    	"name" : "*"
					      }
					    ]
					  },
					"ntWithUndefinedChildNode": {
					    "declaredChildNodeDefinitions": [
					      {
					        "requiredPrimaryTypes": [
					          "undefined"
					        ],
					    	"name" : "*"
					      }
					    ]
					  },
					"nt:base" : {
					},
					"otherNodeType" : {
					},
					"inheritedNodeType" : {
					    "declaredSupertypes": [
						 					      "otherNodeType"
						 					    ]
					}
			}
		};
		var ntManager = new de.sandroboehme.NodeTypeManager(settings);
		var ntBase = ntManager.getNodeType("nt:base");
		var ntResidualChild = ntManager.getNodeType("ntResidualChild");
		
		describe('if the name is valid', function() {
			it('for residual node names', function() {
				expect(ntManager.getNodeType("ntResidualChild").canAddChildNode("childNodeDefName", ntBase)).toBe(true);
			});
			it('for non residual node names', function() {
				expect(ntManager.getNodeType("ntNonResidualChild").canAddChildNode("aChildNodeDef1", ntBase)).toBe(true);
				expect(ntManager.getNodeType("ntNonResidualChild").canAddChildNode("aChildNodeDefA", ntBase)).toBe(false);
			});
		});
		it('if the destination is not protected', function() {
			expect(ntManager.getNodeType("ntNonResidualProtectedChild").canAddChildNode("aChildNodeDef2", ntResidualChild)).toBe(false);
		});
		describe('if the type is valid', function() {
			it('for direct types', function() {
				var otherNodeType = ntManager.getNodeType("otherNodeType");
				expect(ntManager.getNodeType("ntWithOtherChildNode").canAddChildNode("otherNodeType", otherNodeType)).toBe(true);
				expect(ntManager.getNodeType("ntWithOtherChildNode").canAddChildNode("otherNodeType", ntBase)).toBe(false);
			});
			it('for an inherited type', function() {
				var inheritedNodeType = ntManager.getNodeType("inheritedNodeType");
				expect(ntManager.getNodeType("ntWithOtherChildNode").canAddChildNode("inheritedNodeType", inheritedNodeType)).toBe(true);
				expect(ntManager.getNodeType("ntWithOtherChildNode").canAddChildNode("inheritedNodeType", ntBase)).toBe(false);
			});
			it('for an undefined type', function() {
				var otherNodeType = ntManager.getNodeType("otherNodeType");
				expect(ntManager.getNodeType("ntWithUndefinedChildNode").canAddChildNode("otherNodeType", otherNodeType)).toBe(true);
			});
		});
	});
	
	function sameArrayContent(array1, array2){
		expect(array1.length).toBe(array2.length); 
		for (var i=0; i<array2.length; i++){
			if (typeof array2[i] !== "undefined") {
				expect(array1).toContain(array2[i]);
			}
		}
	}

});
