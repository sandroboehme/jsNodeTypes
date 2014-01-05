<%--
Copyright 2013 Sandro Boehme

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
--%>

<!DOCTYPE html>
<%@ page session="false"%>
<%@ page isELIgnored="false"%>
<%@ page import="javax.jcr.*,org.apache.sling.api.resource.Resource"%>
<%@ taglib prefix="sling" uri="http://sling.apache.org/taglibs/sling/1.0"%>
<sling:defineObjects />
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">


<script type="text/javascript" src="../js/jsnodetypes.js"></script>
<script type="text/javascript" src="../documentation/json2.js"></script>

<style type="text/css">
#main {
    border: 1px dashed;
    margin: 0 auto;
    padding: 10px;
    width: 1000px;
}
input {
	margin: 10px 0;
}
.label {
	margin: 5px;
}
#ntNames {
	white-space: pre-wrap;
}
#ntJson {
	display: inline;
}
.code.block-code {
	display: block;
}
.code {
	border: 1px solid black;
	display: inline-block;
	vertical-align: top;
}
.code pre {
	margin: 5px;
}
.nodeTypeMethods {
	display: inline-block;
	margin: 0 10px 10px;
	width: 200px;
}
.doc {
	margin-bottom: 15px;
}
.parameter {
	margin-left: 40px;
}

</style>

<script type="text/javascript">

var settings = {"contextPath": "${pageContext.request.contextPath}"};
var ntManager = new de.sandroboehme.NodeTypeManager(settings);

function getNTNames(){
	var ntNames = ntManager.getNodeTypeNames();
	var ntNamesString = "[ ";
	for (var ntNameIndex in ntNames) {
		ntNamesString+= ntNames[ntNameIndex]
		if (ntNameIndex != ntNames.length-1) {
			ntNamesString += ", ";
		}
	}
	ntNamesString+= " ]";
	document.getElementById("ntNames").innerHTML=ntNamesString;
};

function getNTJson(){
	var ntName = document.getElementById("ntName").value;
	return ntManager.getNodeType(ntName);
};

function loadNTJson(){
	document.getElementById("ntJson").innerHTML=JSON.stringify(getNTJson(), null, 4);
};
function loadChildNodeDefs(){
	var ntJson = getNTJson();
	if (ntJson != null){
		var allChildNodeDefs = ntJson.getAllChildNodeDefinitions();
		document.getElementById("ntMethodResult").innerHTML=JSON.stringify(allChildNodeDefs, null, 4);
	}
};
function loadPropertyDefs(){
	var ntJson = getNTJson();
	if (ntJson != null){
		var propertyDefs = ntJson.getAllPropertyDefinitions();
		document.getElementById("ntMethodResult").innerHTML=JSON.stringify(propertyDefs, null, 4);
	}
};
function canAddChildNode(){
	var ntJson = getNTJson();
	if (ntJson != null){
		var nodeName = document.getElementById("nodeName").value;
		var nodeTypeToAdd = document.getElementById("nodeTypeToAdd").value;
		var canAddChildNode = ntJson.canAddChildNode(nodeName, ntManager.getNodeType(nodeTypeToAdd));
		document.getElementById("ntMethodResult").innerHTML=canAddChildNode;
	}
}
</script>

</head>
<body>
	<div id="main">
		<h1><em>JSNodeTypes</em> - A JavaScript Node Types library for Apache Sling</h1>
		<p>It uses Apache Sling to generate JavaScript object literals for JCR node types. Default binary values are converted to paths where they can be downloaded.</p>
		<h2>Live Demo of the API</h2>
		<p>Have a look at the simple source code of this page to see how it's done.</p>
		<div>
			<input id="ntNamesButton" type="button" value="ntManager.getNodeTypeNames();" onclick="getNTNames();"/>
		</div>
		<div class="block-code code">
			<pre id="ntNames">[]</pre>
		</div>
		
		<div>
			<input id="ntButton" type="button" value="ntManager.getNodeType" onclick="loadNTJson();"/>
			(<input id="ntName" type="text" value="nt:version"/>);
		</div>
		<div>
			<div class="code">
				<pre id="ntJson">{}</pre>
			</div>
			<dl class="nodeTypeMethods">
		    	<dt><input type="button" value="getAllChildNodeDefinitions();" onclick="loadChildNodeDefs();"/></dt>
				<dd class="doc">That method returns the <strong>child node definitions</strong> of the node type and those <strong>of all inherited node types</strong>.</dd>
				<dt><input type="button" value="getAllPropertyDefinitions();" onclick="loadPropertyDefs();"/></dt>
				<dd class="doc">That method returns the <strong>property definitions</strong> of the node type and those <strong>of all inherited node types</strong>.<br/></dd>
				<dt><input type="button" value="canAddChildNode" onclick="canAddChildNode();"/>
						(<input type="text" value="nodeName" id="nodeName" class="parameter"/>,
						<span style="display:inline-block" class="parameter">ntManager.getNodeType(<input type="select" value="nodeTypeToAdd" id="nodeTypeToAdd" class="parameter"/>)</span>);
				</dt>
				<dd class="doc">That method returns `true` if a node with the specified node name and node type can be added as a child node of the current node type. The `undefined` requiredTypes and residual definitions are considered.<br/>The <strong>first parameter is the string</strong> of the node name and the <strong>second parameter is a node type object</strong> (not a string).</dd>
			</dl>
			<div class="code">
				<pre id="ntMethodResult">{}</pre>
			</div>
		</div>
		<h2>License</h2>
		<p>This library is licensed under the terms of the <a href="http://www.apache.org/licenses/LICENSE-2.0.html">Apache 2 license</a>.</p>
		<h2>Compatibility</h2>
		<p>This library has out of the box support for: IE 8.0 standards mode, Firefox 20.0, Chrome 26.0, Opera 12.1 and Safari 5.1</p>
		<h3>Support for older browser versions</h3>
		<p>If you would like to support older browser versions you can download the <a href="https://raw.github.com/douglascrockford/JSON-js/master/json2.js">json2.js script</a> and include it like that:</p>
		<div class="code">
			<pre class="JavaScript">&lt;script type="text/javascript" src="/path/to/json2.js"&gt;&lt;/script&gt;</pre>
		</div>
		<h2>Installation</h2>
		<ol>
			<li>Add <pre>http://www.jcrbrowser.org/sling/obr/repository.xml</pre> to your OSGi Bundle repository in the web console (/system/console/obr)</li>
			<li>In the resource 'J' navigate to 'jsNodeTypes' and 'Deploy and Start' the bundle</li>
			<li>At <pre>/libs/jsnodetypes/content/documentation.html</pre> you should be able to see and use this page.</li> 
		</ol>
		<h2>Use</h2>
		<ol>
			<li>
				<p>Include the JavaScript file to your page:</p>		
				<div class="code">
					<pre class="JavaScript">&lt;script type="text/javascript" src="/libs/jsnodetypes/js/jsnodetypes.js"&gt;&lt;/script&gt;</pre>
				</div>
			</li>
			<li>
				<p>Instantiate the NodeTypeManager:</p>
				<div class="code">
					<pre class="JavaScript">// this works your your WAR is deployed under the root context '/'
var ntManager = new de.sandroboehme.NodeTypeManager();
					</pre>
				</div>
				<p>If your WAR is not deployed under the root context you have to specify it:</p>
				<div class="code">
					<pre class="JavaScript">var settings = {"contextPath": "/yourContextPath"};
var ntManager = new de.sandroboehme.NodeTypeManager(settings);
					</pre>
				</div>
			</li>
			<li>
				<p>Use the NodeTypeManager instance like described above:</p>
				<div class="code">
					<pre class="JavaScript">var nodeTypesArray = ntManager.getNodeTypeNames();
var firstNodeType = ntManager.getNodeType(nodeTypesArray[0]);
var allChildNodeDefs = firstNodeType.getAllChildNodeDefinitions();
var allPropertyDefs = firstNodeType.getAllPropertyDefinitions();
					</pre>
				</div>
			</li>
		</ol>
		<h2>Support</h2>
		<p>
		Bugs can be opened at the <a href="https://github.com/sandroboehme/jsNodeTypes/issues">GitHub issue tracker for the project</a>. For questions I will be monitoring the Sling users mailing list (users@sling.apache.org).
		I'm always looking forward to your feedback. Even if it's critique :-)</p> 
		<h2>Architecture</h2>
	 	<p>The JavaScript NodeTypeManager loads <a href="${pageContext.request.contextPath}/libs/jsnodetypes/content/nodetypes.json">all available node types from the server in the JSON format</a>.</p> 
	 	<p>This is handled by the <code>de.sandroboehme.jsnodetypes.NodeTypesJSONServlet</code> at the server side. It</p> 
	 	<ul>
	 		<li>reads the node types from the repository</li>
	 		<li>converts them to JSON</li>
	 		<li>replaces the default binary values with URL's where they can later be downloaded from</li>
	 		<li>removes the  <a href="${pageContext.request.contextPath}/libs/jsnodetypes/js/defaultNT/defaultNT.json">default values</a></li>
	 		<li>and returns the result back to the JavaScript client.</li>
	 	</ul>
	 	<p>When <code>ntManager.getNodeType(nodeTypeName)</code> is called, the defaults are added again and 
	 	the <code>getAllChildNodeDefinitions()</code> and <code>getAllPropertyDefinitions()</code> functions are added lazily to the JSON object / JavaScript object literal and are finally returned.
	 	</p>
		<h2>Tests</h2>
		<p>All JavaScript tests and Java tests are run in the Maven test phase as usual.
		<h3>JavaScript</h3>
		<p>The JavaScript tests are implemented in <code>src/test/javascript/NodeTypesSpec.js</code> using <a href="http://pivotal.github.com/jasmine/">Jasmine</a>. When you call <code>mvn jasmine:bdd</code> you can edit the tests and refresh the browser at <code>http://localhost:8234</code> to rerun the tests. 
		<h3>Java</h3>
		<p>The Java tests can be found in <code>src/test/java/de/sandroboehme/jsnodetypes</code>. They query the <code>de.sandroboehme.jsnodetypes.NodeTypesJSONServlet</code> while mocking the <code>javax.jcr.nodetype.NodeTypeManager</code> using <a href="http://docs.mockito.googlecode.com/hg/latest/org/mockito/Mockito.html">Mockito</a>.
		The result is then compared to the expected values in the <code>src/test/resources/expectedNTJSON/*.json</code> files using <code>de.sandroboehme.jsnodetypes.testJSONAssert</code>. This class is actually copied from 
		<code>org.apache.sling.commons.json.test.JSONAssert</code>. If somebody knows a better way to reuse this class please open an bug and let me know.
		</p>
		<h2>Build</h2>
		<p>You can check out the sources from <code>https://github.com/sandroboehme/jsNodeTypes</code> and build them with Maven.</p>
	</div>
</body>
</html>
