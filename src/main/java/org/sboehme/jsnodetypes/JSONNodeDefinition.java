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
import java.util.List;

import javax.jcr.nodetype.NodeDefinition;
import javax.jcr.nodetype.NodeType;

/**
 * Represents a NodeDefinition in JSON.
 *
 */
public class JSONNodeDefinition extends JSONItemDefinition {

	private boolean allowsSameNameSiblings;
	private String defaultPrimaryType;
	private String[] requiredPrimaryTypes;

	public JSONNodeDefinition() {
	}

	public JSONNodeDefinition(NodeDefinition childNodeDefinition) {
		super(childNodeDefinition);

		this.setAllowsSameNameSiblings(childNodeDefinition.allowsSameNameSiblings());
		
		NodeType defaultPrimaryType = childNodeDefinition.getDefaultPrimaryType();
		if (defaultPrimaryType != null) {
			this.setDefaultPrimaryType(defaultPrimaryType.getName());
		}

		NodeType[] primaryTypes = childNodeDefinition.getRequiredPrimaryTypes();
		List<String> primaryTypeNames = new ArrayList<String>();
		for (NodeType primaryType : primaryTypes) {
			String primaryTypeName = primaryType.getName();
			if (primaryTypeName != null) {
				primaryTypeNames.add(primaryTypeName);
			}
		}

		this.setRequiredPrimaryTypes(primaryTypeNames.toArray(new String[primaryTypeNames.size()]));
	}

	public boolean isAllowsSameNameSiblings() {
		return allowsSameNameSiblings;
	}

	public void setAllowsSameNameSiblings(boolean allowsSameNameSiblings) {
		this.allowsSameNameSiblings = allowsSameNameSiblings;
	}

	public String getDefaultPrimaryType() {
		return defaultPrimaryType;
	}

	public void setDefaultPrimaryType(String defaultPrimaryType) {
		this.defaultPrimaryType = defaultPrimaryType;
	}

	public String[] getRequiredPrimaryTypes() {
		return requiredPrimaryTypes;
	}

	public void setRequiredPrimaryTypes(String[] requiredPrimaryTypes) {
		this.requiredPrimaryTypes = requiredPrimaryTypes;
	}

}
