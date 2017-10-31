'use strict';

let app = require('../../server/server.js');

module.exports = function(Donor) {

    
   

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

  




};

//dqH1D2DDUYHCa4ytDSyBaWGP9T6JT70TagGtDWMAfOj6gTy2fa34FGPkeMXCTft6
//59f8396b7d4b0e02df61dcd3