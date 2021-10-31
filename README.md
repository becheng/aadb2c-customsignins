# Custom Sign-in Policies
This repo contains custom Azure AD custom policies of custom sign-in identity experiences. 
## Sign-in with Username prefixed with an Org ID (CustomSignInCombiningOrgId.xml)

An Azure AD B2C custom policy using a custom sign-in page where users are able to enter their sign-in username, password and organization identifier to login with their B2C local account. 

To run this sample, you'll need to be set up with the [B2C starter pack](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack). 

![](images/signinplusorgid_1.jpg)

![](images/signinplusorgid_2.jpg)

![](images/signinplusorgid_3.jpg)

## Sign-in with Org ID + Username with JIT User Migration  (CustomSignInCombiningOrgIdWithJITMigration.xml)
Same policy above combined with just-in-time (jit) user migration based on this B2C sample: https://github.com/azure-ad-b2c/user-migration.  This sample only covers the sign-in flow.  Refer to the original sample to implement jit migration for the sign-up and password reset flows. 

Note: the migration api in this sample was written as a javascript Azure function.