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
package org.sboehme.jsnodetypes;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import javax.jcr.RepositoryException;
import javax.jcr.ValueFormatException;
import javax.jcr.nodetype.NodeDefinition;
import javax.jcr.nodetype.NodeType;
import javax.jcr.nodetype.PropertyDefinition;

/**
 * Represents a NodeType in JSON.
 *
 */
public class JSONNodeType {

	private boolean mixin;
	private boolean orderableChildNodes;
	private String[] declaredSupertypes;
	private String primaryItemName;
	private List<JSONPropertyDefinition> declaredPropertyDefinitions = null;
	private List<JSONNodeDefinition> declaredChildNodeDefinitions = null;

	public JSONNodeType(NodeType nodeType) throws ValueFormatException, RepositoryException {
		List<JSONNodeDefinition> declaredChildNodeDefinitionList = new LinkedList<JSONNodeDefinition>();
		NodeDefinition[] declaredChildNodeDefinitions = nodeType.getDeclaredChildNodeDefinitions();
		if (declaredChildNodeDefinitions != null) {
			for (NodeDefinition childNodeDefinition : nodeType.getDeclaredChildNodeDefinitions()) {
				String childNodeName = childNodeDefinition.getName();
				if (childNodeName != null) {
					JSONNodeDefinition jsonChildNodeDefinition = new JSONNodeDefinition(childNodeDefinition);
					declaredChildNodeDefinitionList.add(jsonChildNodeDefinition);
				}
			}
			this.setDeclaredChildNodeDefinitions(declaredChildNodeDefinitionList);
		}

		List<JSONPropertyDefinition> declaredPropertyDefinitionList = new LinkedList<JSONPropertyDefinition>();
		PropertyDefinition[] declaredPropertyDefinitions = nodeType.getDeclaredPropertyDefinitions();
		if (declaredPropertyDefinitions != null) {
			for (PropertyDefinition propertyDefinition : declaredPropertyDefinitions) {
				JSONPropertyDefinition jsonPropertyDefinition = new JSONPropertyDefinition(propertyDefinition);
				declaredPropertyDefinitionList.add(jsonPropertyDefinition);
			}
			this.setDeclaredPropertyDefinitions(declaredPropertyDefinitionList);
		}

		NodeType[] superTypes = nodeType.getDeclaredSupertypes();
		List<String> superTypeNames = new ArrayList<String>();
		for (NodeType superType : superTypes) {
			superTypeNames.add(superType.getName());
		}
		this.setDeclaredSupertypes(superTypeNames.toArray(new String[superTypeNames.size()]));
		this.setMixin(nodeType.isMixin());
		this.setOrderableChildNodes(nodeType.hasOrderableChildNodes());
		this.setPrimaryItemName(nodeType.getPrimaryItemName());
	}

	public JSONNodeType() {
	}

	public boolean isMixin() {
		return mixin;
	}

	public void setMixin(boolean isMixin) {
		this.mixin = isMixin;
	}

	public boolean hasOrderableChildNodes() {
		return orderableChildNodes;
	}

	public void setOrderableChildNodes(boolean orderableChildNodes) {
		this.orderableChildNodes = orderableChildNodes;
	}

	public String getPrimaryItemName() {
		return primaryItemName;
	}

	public void setPrimaryItemName(String primaryItemName) {
		this.primaryItemName = primaryItemName;
	}

	public List<JSONPropertyDefinition> getDeclaredPropertyDefinitions() {
		return declaredPropertyDefinitions;
	}

	public void setDeclaredPropertyDefinitions(List<JSONPropertyDefinition> declaredPropertyDefinitions) {
		this.declaredPropertyDefinitions = declaredPropertyDefinitions;
	}

	public List<JSONNodeDefinition> getDeclaredChildNodeDefinitions() {
		return declaredChildNodeDefinitions;
	}

	public void setDeclaredChildNodeDefinitions(List<JSONNodeDefinition> declaredChildNodeDefinitions) {
		this.declaredChildNodeDefinitions = declaredChildNodeDefinitions;
	}

	public String[] getDeclaredSupertypes() {
		return declaredSupertypes;
	}

	public void setDeclaredSupertypes(String[] declaredSupertypes) {
		this.declaredSupertypes = declaredSupertypes;
	}

}
