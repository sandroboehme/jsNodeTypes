/*******************************************************************************
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
 ******************************************************************************/
package de.sandroboehme.jsnodetypes;

import java.lang.reflect.Type;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class JSONNodeTypeDefaults implements JsonSerializer<JSONNodeType> {

	@Override
	public JsonElement serialize(JSONNodeType nodeType, Type type, JsonSerializationContext jsc) {
		Gson gson = new Gson();
		JsonObject nodeTypeObj = (JsonObject) gson.toJsonTree(nodeType);
		removeNodeTypeDefaults(nodeType, nodeTypeObj);
		removePropertyDefinitionDefaults(nodeTypeObj.getAsJsonArray("declaredPropertyDefinitions"));
		removeNodeDefinitionDefaults(nodeTypeObj.getAsJsonArray("declaredChildNodeDefinitions"));
		
		return nodeTypeObj;
	}

	private void removeNodeDefinitionDefaults(JsonArray nodeDefinitionArray) {
		if (nodeDefinitionArray!=null){
			for (JsonElement nodeDefinitionElement : nodeDefinitionArray) {
				JsonObject nodeDefinition = (JsonObject) nodeDefinitionElement;
				
				String memberName = "allowsSameNameSiblings";
				if (!nodeDefinition.get(memberName).getAsBoolean()) {
					nodeDefinition.remove(memberName);
				}
				memberName = "defaultPrimaryType";
				if (nodeDefinition.get(memberName) == null || "".equals(nodeDefinition.get(memberName).getAsString())) {
					nodeDefinition.remove(memberName);
				}
				memberName = "requiredPrimaryTypes";
				JsonElement requiredPrimaryTypesElement = nodeDefinition.get(memberName);
				JsonArray requiredPrimaryTypes = requiredPrimaryTypesElement != null ? requiredPrimaryTypesElement.getAsJsonArray() : null;
				if (requiredPrimaryTypes == null || requiredPrimaryTypes.size()==1 && "nt:base".equals(((JsonPrimitive)requiredPrimaryTypes.get(0)).getAsString())) {
					nodeDefinition.remove(memberName);
				}
				removeItemDefinitionDefaults(nodeDefinition);
			}
		}
	}

	private void removeNodeTypeDefaults(JSONNodeType nodeType, JsonObject nodeTypeObj) {
		if (!nodeType.isMixin()) {
			nodeTypeObj.remove("mixin");
		}
		if (!nodeType.hasOrderableChildNodes()) {
			nodeTypeObj.remove("orderableChildNodes");
		}
		String[] supertypes = nodeType.getDeclaredSupertypes();
		boolean inheritsOnlyFromNTBase = supertypes != null && supertypes.length == 1 && "nt:base".equals(supertypes[0]);
		if (inheritsOnlyFromNTBase) {
			nodeTypeObj.remove("declaredSupertypes");
		}
	}

	private void removePropertyDefinitionDefaults(JsonArray propertyDefinitionArray) {
		if (propertyDefinitionArray!=null){
			for (JsonElement propertyDefinitionElement : propertyDefinitionArray) {
				JsonObject propertyDefinition = (JsonObject) propertyDefinitionElement;
				String memberName = "defaultValues";
				boolean valueIsNull = propertyDefinition.get(memberName) == null;
				if (valueIsNull || propertyDefinition.get(memberName).getAsJsonArray() == null || propertyDefinition.get(memberName).getAsJsonArray().size()==0) {
					propertyDefinition.remove(memberName);
				}
				memberName = "valueConstraints";
				valueIsNull = propertyDefinition.get(memberName) == null;
				if (valueIsNull || propertyDefinition.get(memberName).getAsJsonArray() == null || propertyDefinition.get(memberName).getAsJsonArray().size()==0) {
					propertyDefinition.remove(memberName);
				}
				memberName = "requiredType";
				if ("String".equals(propertyDefinition.get(memberName).getAsString())) {
					propertyDefinition.remove(memberName);
				}
				memberName = "multiple";
				if (!propertyDefinition.get(memberName).getAsBoolean()) {
					propertyDefinition.remove(memberName);
				}
				removeItemDefinitionDefaults(propertyDefinition);
			}
		}
	}
	
	private void removeItemDefinitionDefaults(JsonObject propertyDefinition) {
		String memberName = "autoCreated";
		if (!propertyDefinition.get(memberName).getAsBoolean()) {
			propertyDefinition.remove(memberName);
		}
		memberName = "mandatory";
		if (!propertyDefinition.get(memberName).getAsBoolean()) {
			propertyDefinition.remove(memberName);
		}
		memberName = "protected";
		if (!propertyDefinition.get(memberName).getAsBoolean()) {
			propertyDefinition.remove(memberName);
		}
		memberName = "onParentVersion";
		if ("COPY".equals(propertyDefinition.get(memberName).getAsString())) {
			propertyDefinition.remove(memberName);
		}
	}
	
}
