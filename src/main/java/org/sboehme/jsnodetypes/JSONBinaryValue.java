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

import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import javax.jcr.ValueFormatException;
import javax.jcr.nodetype.PropertyDefinition;
import javax.jcr.version.OnParentVersionAction;

/**
 * Represents a Value object of a binary property in JSON.
 * If the value is also of type binary its string will contain the URL to download the binary content from.
 *
 */
public class JSONBinaryValue extends JSONValue {

	public JSONBinaryValue(Value aValue, int index, PropertyDefinition propertyDef) throws ValueFormatException,
			RepositoryException {

		switch (aValue.getType()) {
		case PropertyType.STRING:
			string = aValue.getString();
			break;
		case PropertyType.DATE:
			date = aValue.getDate();
			break;
		case PropertyType.BINARY:
			string = getBinaryDownloadURLFromPropertyDef(index, propertyDef);
			break;
		case PropertyType.DOUBLE:
			aDouble = aValue.getDouble();
			break;
		case PropertyType.LONG:
			aLong = aValue.getLong();
			break;
		case PropertyType.BOOLEAN:
			aBoolean = aValue.getBoolean();
			break;
		case PropertyType.NAME:
			string = aValue.getString();
			break;
		case PropertyType.PATH:
			string = aValue.getString();
			break;
		case PropertyType.REFERENCE:
			string = aValue.getString();
			break;
		default:
			break;
		}
		super.setType(PropertyType.nameFromValue(aValue.getType()));
	}

	private String getBinaryDownloadURLFromPropertyDef(int index, PropertyDefinition propertyDef) {
		String nodeTypeName = propertyDef.getDeclaringNodeType().getName();
		String propertyName = propertyDef.getName();
		String propertyType = PropertyType.nameFromValue(propertyDef.getRequiredType());
		boolean isAutoCreated = propertyDef.isAutoCreated();
		boolean isMandatory = propertyDef.isMandatory();
		boolean isProtected = propertyDef.isProtected();
		boolean isMultiple = propertyDef.isMultiple();
		String onParentVersionAction = OnParentVersionAction.nameFromValue(propertyDef.getOnParentVersion());
		return String.format("/%s/%s/%s/%s/%s/%s/%s/%s/%s.default_binary_value.bin", nodeTypeName, propertyName,
				propertyType, isAutoCreated, isMandatory, isProtected, isMultiple, onParentVersionAction, index);
	}

}
