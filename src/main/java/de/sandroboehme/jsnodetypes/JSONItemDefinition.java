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

import javax.jcr.nodetype.ItemDefinition;
import javax.jcr.version.OnParentVersionAction;

import com.google.gson.annotations.SerializedName;

/**
 * Represents an ItemDefinition in JSON.
 */
public class JSONItemDefinition {

	private boolean autoCreated;
	private boolean mandatory;
	@SerializedName("protected")
	private boolean isProtected;
	private String onParentVersion = OnParentVersionAction.ACTIONNAME_COPY;
	private String name;
	
	public JSONItemDefinition(){
	}
	
	public JSONItemDefinition(ItemDefinition itemDefinition) {
		this.setName(itemDefinition.getName());
		this.setAutoCreated(itemDefinition.isAutoCreated());
		this.setMandatory(itemDefinition.isMandatory());
		boolean onParentVersionIsUnset = itemDefinition.getOnParentVersion() == 0;
		int onParentVersion = onParentVersionIsUnset ? OnParentVersionAction.COPY : itemDefinition.getOnParentVersion();
		this.setOnParentVersion(OnParentVersionAction.nameFromValue(onParentVersion));
		this.setProtected(itemDefinition.isProtected());
	}
	
	public String getOnParentVersion() {
		return onParentVersion;
	}
	public void setOnParentVersion(String onParentVersion) {
		this.onParentVersion = onParentVersion;
	}
	public boolean isAutoCreated() {
		return autoCreated;
	}
	public void setAutoCreated(boolean isAutoCreated) {
		this.autoCreated = isAutoCreated;
	}
	public boolean isMandatory() {
		return mandatory;
	}
	public void setMandatory(boolean isMandatory) {
		this.mandatory = isMandatory;
	}
	public boolean isProtected() {
		return isProtected;
	}
	public void setProtected(boolean isProtected) {
		this.isProtected = isProtected;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}
