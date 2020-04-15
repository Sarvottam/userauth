const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
    ac.grant("investor")
        .createOwn('profile')
        .readOwn("profile")
        .updateOwn("profile")

    ac.grant("propertyOwner")
        .extend("investor")
        .createOwn('project')
        .updateOwn("project")
        .readOwn('project')
        .deleteOwn('Project')


    ac.grant("admin")
        .extend("investor")
        .extend("projectOwner")
        .createAny('project')
        .updateAny("project")
        .readAny('project')
        .deleteAny('Project')
        .createAny('rofile')
        .updateAny("profile")
        .readAny('profile')
        .deleteAny('profile')
    return ac;
})();