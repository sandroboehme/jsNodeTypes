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
package org.sboehme.jsnodetypes.downloaddefaultbinary;

import javax.jcr.nodetype.PropertyDefinition;

public class PropertyNameMatcher extends AbstractPropertyMatcher implements PropertyMatcher{

	public PropertyNameMatcher(String[] idFields, int index){
		super.idFields = idFields;
		super.index = index;
	}
	
	@Override
	public boolean match(PropertyDefinition propertyDefinition) {
		String arrayValue = super.getArrayValue(idFields, index);
		if (arrayValue!=null){
			String propName = propertyDefinition.getName();
			return arrayValue.equals(propName);
		}
		return false;
	}
	
}
