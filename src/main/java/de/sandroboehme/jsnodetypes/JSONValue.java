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

import java.util.Calendar;

import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import javax.jcr.ValueFormatException;

import com.google.gson.annotations.SerializedName;

/**
 * Represents a javax.jcr.Value in JSON.
 *
 */
public class JSONValue {

	protected String string;
	protected Calendar date;
	//binary
	@SerializedName("double")
	protected Double aDouble;
	@SerializedName("long")
	protected Long aLong;
	@SerializedName("boolean")
	protected Boolean aBoolean;
	protected String type;
	
    public JSONValue(){
    }
    
    public JSONValue(Value aValue) throws ValueFormatException, RepositoryException{
    	switch (aValue.getType()) {
		case PropertyType.STRING:
	    	string = aValue.getString();
			break;
		case PropertyType.DATE:
	    	date = aValue.getDate();
			break;
		case PropertyType.BINARY:
			string = aValue.getString();
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
    	type = PropertyType.nameFromValue(aValue.getType());
    }
    
	public Boolean isBoolean() {
		return aBoolean;
	}
	public void setBoolean(boolean aBoolean) {
		this.aBoolean = aBoolean;
	}
	public Calendar getDate() {
		return date;
	}
	public void setDate(Calendar date) {
		this.date = date;
	}
	public Double getDouble() {
		return aDouble;
	}
	public void setDouble(double aDouble) {
		this.aDouble = aDouble;
	}
	public Long getLong() {
		return this.aLong;
	}
	public void setLong(long aLong) {
		this.aLong = aLong;
	}

	public String getString() {
		return string;
	}
	public void setString(String aString) {
		this.string = aString;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}

}
