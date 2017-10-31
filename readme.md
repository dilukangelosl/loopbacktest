#Create Empty Lb Project
#Create USer models extending USer object

#Add these to model.config

  "AccessToken": {
    "dataSource": "db",
    "public": false
  },
  "ACL": {
    "dataSource": "db",
    "public": false
  },
  "RoleMapping": {
    "dataSource": "db",
    "public": true,
    "options": {
      "strictObjectIDCoercion": true
    }
  },
  "Role": {
    "dataSource": "db",
    "public": true
  }


#enable auth by adding server/boot/authentication.js
#Add { datasource: 'db' } if not using custom tokens
module.exports = function enableAuthentication(server) {
    server.enableAuth({ datasource: 'db' });
  };


  #Create a Role Manual

  let app = require('../../server/server.js');

   Donor.afterRemote("create", function( ctx,modelinstace, next) {
        var Role = app.models.Role;
        var RoleMapping = app.models.RoleMapping;
        var id = ctx.result.id;

        Role.find({ name: 'admin' }, function(err, results) {
            if (err) { throw err;}
        
            if (results.length < 1) {
                console.log("Role does not exsists, Creating new Role");
                Role.create({
                    name:'admin'
                }, function(err,role){
                    if (err) throw err;
                    console.log('Created role:', role);
        
                    //Make an admin
                    role.principals.create({
                        principalType: RoleMapping.USER,
                        principalId: id
                      }, function(err, principal) {
                        if (err) throw err;
                
                        console.log('Created principal:', principal);
                      });
                })
            }else{
                //Make an admin
               
                console.log("Role Already exsists");
                RoleMapping.create({
                    principalType: RoleMapping.USER,
                    principalId: id,
                    roleId: results[0].id
                  }, function(err, principal) {
                    if (err) throw err;
            
                    console.log('Created principal:', principal);
                  });
            }
        });



       
        next();
    });

    #Add to ACL

     {
      "accessType": "*",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "DENY"
    },
    {
      "accessType": "*",
      "principalType": "ROLE",
      "principalId": "admin",
      "permission": "ALLOW"
    }

    #Add dynamic auto roles according to models

    https://loopback.io/doc/en/lb3/Defining-and-using-roles.html