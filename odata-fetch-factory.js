const domains = [];
export const ODataFetchFactory = ({
    fetch,
    domain = ""
}) => {
    return ({
        method = "GET",
        body = null,
        entity = null,
        action = null,
        funct = null,
        key = null,
        filter = null,
        expand = null,
        top = null,
        orderby = null,
        select = null,
        apply = null,
        skip = null,
        metadata = false,
        customParameters = null,
        count = null
    } = {}) => {
        const _validateParameters = () => {
            const METHODS = ["GET", "POST", "PATCH", "PUT", "DELETE"];
            if (method != "POST" && action != null) {
                throw new Error(
                    "odata-fetch: el metodo " +
                    method +
                    " no es válido para invocar un 'action'"
                );
            }
            if (method != "GET" && funct != null) {
                throw new Error(
                    "odata-fetch: el metodo " +
                    method +
                    " no es válido para invocar un 'function'"
                );
            }
            if (!METHODS.find(m => m == method)) {
                throw new Error("odata-fetch: parámetro 'method' no válido");
            }
            if (method == "GET" && body != null) {
                throw new Error(
                    "odata-fetch: el parámetro 'body' debe estar vacío cuando el parámetro 'method' es 'GET'"
                );
            }
            if (entity == null && action == null && funct == null && !metadata) {
                throw new Error(
                    "odata-fetch: debe especidifcar el menos uno de estos parametros 'entity','action','funct', 'metadata'"
                );
            }
        };
        _validateParameters();
        let url = domain + "/odata/";
        const fetchParams = {
            method: method,
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (method != "GET") {
            fetchParams.body = JSON.stringify(body);
        }
        if (method == "PUT" || method == "PATCH" || method == "DELETE") {
            key = body.Id;
        }
        if (!metadata) {
            if (action) {
                if (entity) {
                    if (key) entity = entity + "(" + key + ")";
                    url += entity + "/";
                }
                url += action;
            }
            if (funct) {
                if (entity) {
                    if (key) entity = entity + "(" + key + ")";
                    url += entity + "/";
                }
                url += funct;
            }
            if (entity && !action && !funct) {
                if (key) entity = entity + "(" + key + ")";
                url += entity + "/?"
                if (expand) url += "$expand=" + expand;
                if (top) url += "&$top=" + top;
                if (filter) url += "&$filter=" + filter;
                if (orderby) url += "&$orderby=" + orderby;
                if (select) url += "&$select=" + select;
                if (apply) url += "&$apply=" + apply;
                if (skip) url += "&$skip=" + skip;
                if (customParameters) url += "&" + customParameters;
                if (count) url += "&$count=true"
            }
            return fetch(url, fetchParams)
                .then(response => response.json())
                .then(data => {
                    if (data == undefined) throw new Error("No se puede acceder al servidor, verifique sus credenciales")
                    if (data.value != undefined) {
                        if (typeof data.value === "object") data.value.__odataCount = (data["@odata.count"]) || 0
                        return data.value
                    }
                    if (data.error) throw new Error(data.error.message)
                    return data
                })
        } else {
            const doma = domains.find(dom => dom.domain == domain);
            if (doma != undefined) {
                return new Promise((resoleve, reject) => {
                    resoleve(doma.meta);
                });
            } else {
                url += "$metadata";
                return fetch(url, fetchParams)
                    .then(
                        response => response.text()
                    )
                    .then(str => {
                        const meta = xmlToJson(
                            new window.DOMParser().parseFromString(str, "text/xml")
                        )["edmx:Edmx"]["edmx:DataServices"]["Schema"][0];
                        domains.push({
                            domain: domain,
                            meta: meta
                        });
                        return meta;
                    });
            }
        }
    };
}

function xmlToJson(xml) {
    var obj = {};
    if (xml.nodeType == 1) {
        // element
        // do attributes
        if (xml.attributes.length > 0) {
            //obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                //obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                obj[attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {
        // text
        obj = xml.nodeValue;
    }
    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof obj[nodeName] == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof obj[nodeName].push == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}