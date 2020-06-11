import userRoles from 'types/userRoles';

export default function User() {
  this.name = '';
  this.email = '';
  this.password = '';
  this.role = userRoles.EDITOR.value;
  this.isEnabled = true;
  this.createDT = null;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}
