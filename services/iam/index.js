
import createServiceRole from './createServiceRole';
import createPolicy from './createPolicy';
import attachPolicyToRole from './attachPolicyToRole';
import cbPolicy from './policies/codebuild.js'
import cbTrustPolicy from './policies/trustPolicyCodeBuild.js'
import { printError } from '../../utils'
import updateRoleWithPolicy from './updateRoleWithPolicy';


const createIamPermissions = async () => {
  try {
    createServiceRole(cbTrustPolicy).then((res) => {
      let roleName = res.Role.RoleName;

      updateRoleWithPolicy(cbPolicy, roleName);
    })
  } catch (e){
    console.error(e)
  }
}

createIamPermissions()
export default createIamPermissions 