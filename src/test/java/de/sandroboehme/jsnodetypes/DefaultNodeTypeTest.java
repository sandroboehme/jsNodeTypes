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

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;

import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.ValueFormatException;
import javax.jcr.nodetype.NodeDefinition;
import javax.jcr.nodetype.NodeType;
import javax.jcr.nodetype.PropertyDefinition;
import javax.servlet.ServletException;

import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.apache.sling.commons.json.JSONTokener;
import org.junit.Before;
import org.junit.Test;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import de.sandroboehme.jsnodetypes.JSONNodeType;
import de.sandroboehme.jsnodetypes.JSONNodeTypeDefaults;
import de.sandroboehme.jsnodetypes.mock.MockNodeTypeGenerator;
import de.sandroboehme.jsnodetypes.test.JSONAssert;

/**
 * Tests if the JSON is generated with the default values omitted.
 */
public class DefaultNodeTypeTest extends MockNodeTypeGenerator{
	
	@Before
	public void setUp() throws RepositoryException, IOException{
		super.setUp();
	}

	private String getDefaultNTJSON() throws IOException {
		URL fileUri = MockNodeTypeGenerator.class.getResource("/SLING-INF/libs/jsnodetypes/js/defaultNT/defaultNT.json");
		BufferedReader in = new BufferedReader(new FileReader(fileUri.getFile()));
		String currentLine = null;
		StringBuilder fileContent = new StringBuilder();
		while ((currentLine = in.readLine()) != null) {
			fileContent.append(currentLine);
		}
		return fileContent.toString();
	}
	
	/**
	 * Loads the defaultNT.json file that contains only default values and checks if an empty JSON object is generated from that.
	 * Because this means the default values are actually not written.
	 * @throws JSONException 
	 */
	@Test
	public void testIfDefaultsAreOmittedWithoutServlet() throws IOException, JSONException{
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setPrettyPrinting();
		gsonBuilder.registerTypeAdapter(JSONNodeType.class, new JSONNodeTypeDefaults());
		Gson gson=gsonBuilder.create();
		
		String json = getDefaultNTJSON(); 
		JSONNodeType defaultNT = gson.fromJson(json, JSONNodeType.class);   
		String jsonDeserializedFromDefaultNT = gson.toJson(defaultNT);
		JSONObject jsonObjectDeserializedFromDefaultNT = new JSONObject(new JSONTokener(jsonDeserializedFromDefaultNT));
		
		String expectedNTJSON = super.getExpectedNTJSON("testIfDefaultsAreOmittedWithoutServlet");

		
		JSONAssert.assertEquals("Actual JSON: " + jsonDeserializedFromDefaultNT + "\nExpected JSON: " + expectedNTJSON, new JSONObject(
				new JSONTokener(expectedNTJSON)), jsonObjectDeserializedFromDefaultNT);
	}

	/**
	 * Simulates a node type in the repository that has only default values and checks if they are omitted in the generated
	 * JSON file. 
	 */
	@Test
	public void testIfDefaultsAreOmittedWithServlet() throws JSONException, ServletException, IOException, ValueFormatException, IllegalStateException, RepositoryException{
		NodeType nt1 = getSimpleNodeTypeWithName("testNodeType");
		when(nodeTypeIterator.nextNodeType()).thenReturn(nt1);
		when(nodeTypeIterator.hasNext()).thenReturn(Boolean.TRUE, Boolean.FALSE);

		NodeType ntBase = mock(NodeType.class);
		when(ntBase.getName()).thenReturn("nt:base");

		NodeDefinition childNodeDef1 = mock(NodeDefinition.class);
		NodeType[] reqPrimaryTypes = { ntBase };
		when(childNodeDef1.getRequiredPrimaryTypes()).thenReturn(reqPrimaryTypes);
		when(childNodeDef1.getName()).thenReturn("childNodeDef");
		
		NodeDefinition[] childNodeDefs = {childNodeDef1};
		when(nt1.getDeclaredChildNodeDefinitions()).thenReturn(childNodeDefs);

		String propertyName = "stringPropertyDef";
		PropertyDefinition propertyDef = mock(PropertyDefinition.class);
		when(propertyDef.getRequiredType()).thenReturn(PropertyType.STRING);
		when(propertyDef.getName()).thenReturn(propertyName);
		
		when(nt1.getDeclaredPropertyDefinitions()).thenReturn(new PropertyDefinition[]{propertyDef});

		assertEqualsWithServletResult("testIfDefaultsAreOmittedWithServlet");
	}
	
}
