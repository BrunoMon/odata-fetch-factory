export const ODataEntity = (ODataFetch, entity) => {
    const getMetadata = () => {
        return ODataFetch({
            metadata: true
        }).then(meta =>
            meta.EntityType.find(type => type.Name == entity)
        );
    };
    return {
        get: ({
                key = null,
                top = null,
                filter = null,
                expand = null,
                orderby = null,
                select = null,
                apply = null,
                skip = null,
                customParameters = null,
                count,
                credentials,
                token
            }) =>
            ODataFetch({
                method: "GET",
                entity: entity,
                key: key,
                top: top,
                filter: filter,
                expand: expand,
                orderby: orderby,
                select: select,
                apply: apply,
                skip: skip,
                customParameters: customParameters,
                count: count,
                credentials: credentials,
                token: token
            }),
        post: (body,token) => {
            return ODataFetch({
                method: "POST",
                entity: entity,
                body: body,
                token:token
            });
        },
        action: (action, body, key,token) => {
            return ODataFetch({
                method: "POST",
                action: action,
                entity: entity,
                body: body,
                key: key,
                token:token
            });
        },
        execute: (funct, body,token) => {
            return ODataFetch({
                method: "GET",
                funct: funct,
                body: body,
                token:token
            });
        },
        put: (body,token) => {
            return ODataFetch({
                method: "PUT",
                entity: entity,
                body: body,
                token:token
            });
        },
        delete: (body,token) => {
            return ODataFetch({
                method: "DELETE",
                entity: entity,
                body: body,
                token:token
            });
        },
        patch: (body,token) => {
            return ODataFetch({
                method: "PATCH",
                entity: entity,
                body: body,
                token:token
            });
        },
        getEmpty: () => {
            return getMetadata().then(type => {
                return type.Property.reduce((obj, prop) => {
                    switch (prop.Type) {
                        case "Edm.String":
                            obj[prop.Name] = "";
                            break;
                        case "Edm.Boolean":
                            obj[prop.Name] = false;
                            break;
                        case "Edm.DateTimeOffset":
                            obj[prop.Name] = new Date(1970, 0, 1, 0, 0, 0).toJSON();
                            break;
                        case "Edm.DateTime":
                            obj[prop.Name] = new Date(1970, 0, 1, 0, 0, 0).toJSON();
                            break;
                        default:
                            obj[prop.Name] = 0;
                            break;
                    }
                    return obj;
                }, {});
            });
        }
    };
}