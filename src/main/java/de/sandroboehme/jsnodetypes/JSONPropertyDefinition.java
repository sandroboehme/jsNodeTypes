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

import java.util.ArrayList;
import java.util.List;

import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import javax.jcr.ValueFormatException;
import javax.jcr.nodetype.PropertyDefinition;

/**
 * Represents a PropertyDefinition in JSON.
 *
 */
public class JSONPropertyDefinition extends JSONItemDefinition {

	private JSONValue[] defaultValues;
	private String requiredType = "String";
	private String[] valueConstraints;
	private boolean multiple;

	public JSONPropertyDefinition() {
	}

	public JSONPropertyDefinition(PropertyDefinition propertyDefinition) throws ValueFormatException, RepositoryException {
		super(propertyDefinition);

		List<JSONValue> defaultValueList = new ArrayList<JSONValue>();
		Value[] specifiedDefaultValues = propertyDefinition.getDefaultValues();
		if (specifiedDefaultValues != null) {
			Value[] defaultValues = propertyDefinition.getDefaultValues();
			if (defaultValues !=null){
				for (int i=0; i<defaultValues.length; i++){
					Value defaultValue = defaultValues[i];
					if (defaultValue.getType() == PropertyType.BINARY){
						defaultValueList.add(new JSONBinaryValue(defaultValue, i, propertyDefinition));
					} else {
						defaultValueList.add(new JSONValue(defaultValue));
					}
				}
			}
			this.setDefaultValues(defaultValueList.toArray(new JSONValue[defaultValueList.size()]));
		}

		this.setMultiple(propertyDefinition.isMultiple());

		this.setRequiredType(PropertyType.nameFromValue(propertyDefinition.getRequiredType()));

		this.setValueConstraints(propertyDefinition.getValueConstraints());
	}

	public JSONValue[] getDefaultValues() {
		return defaultValues;
	}

	public void setDefaultValues(JSONValue[] defaultValues) {
		this.defaultValues = defaultValues;
	}

	public String getRequiredType() {
		return requiredType;
	}

	public void setRequiredType(String requiredType) {
		this.requiredType = requiredType;
	}

	public String[] getValueConstraints() {
		return valueConstraints;
	}

	public void setValueConstraints(String[] valueConstraints) {
		this.valueConstraints = valueConstraints;
	}

	public boolean isMultiple() {
		return multiple;
	}

	public void setMultiple(boolean isMultiple) {
		this.multiple = isMultiple;
	}
}
