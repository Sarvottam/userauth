pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;

contract MinuteManUserInfo {
    uint projectIdSc = 0;
    enum Role { Admin, ProjectOwnerAndInvestor, ProjectOwner, Investor}
    enum ProjectNegotiationStatus {Pending, Done}
    address SuperUser;

    struct UserInfo {
      string  email;
      bool accountExist;
      string  name;
      string  dob;
      bool isUserActive;
      string kycDocHash;
      Role role;

      uint[] projectInvestedIn;
      BankDetails userBankDetails;
      uint[] projectListed;
   }

   struct BankDetails {
       string accNo;
       string bnkName;
       bool isACHAllowed;
       bool isAccountVerified;
   }
    struct ProjectInfo {
      string  projectName;
      string  projectId;
      uint projectCost ;
      uint monthlyPercentage;
      int  finalCheckoutPaymentPercentage; // when project is sold
      bool canChangeDetails; //only before first investment
  }

  struct costNegotiated {
      uint amountPaid;
      uint monthlyPercentage;
      bool negotiationDone;
      uint[] paymentTimestamp;
  }

  mapping(address => UserInfo)public UserData;
  mapping(address => mapping(uint => ProjectInfo)) public UserWiseProjectCreated; // Project Owner with all the details of the project created
//   mapping(address => uint[]) public ProjectOwner //ProjectIds of all the project A owner owns
 
  // e.g "0xabcdef"=> 1 =>{
                            //projectName
                            //projectId
                            //projectCost
                            //monthlyPercentage
                            //finalCheckoutPaymentPercentage
                            //canChangeDetails
                          //}
                    // 23 => {
                            //projectName
                            //projectId
                            //projectCost
                            //monthlyPercentage
                            //finalCheckoutPaymentPercentage
                            //canChangeDetails
                        //}
 // }

  // e.g "0xfgretion"=> 1 =>{
                            //projectName
                            //projectId
                            //projectCost
                            //monthlyPercentage
                            //finalCheckoutPaymentPercentage
                            //canChangeDetails
                          //}
                    // 23 => {
                            //projectName
                            //projectId
                            //projectCost
                            //monthlyPercentage
                            //finalCheckoutPaymentPercentage
                            //canChangeDetails
                        //}
 // }
  mapping(string => uint) internal projectIds;// From usergeneratedIds to sc generatedIds
  //this nested mapping will keep tab of how much a user has invested in particular project
  mapping(address => mapping(uint=>costNegotiated)) internal userToProjectIdTocostNegotiated;


  modifier onlyOwner(){
      require(msg.sender == SuperUser,"not superuser");
      _;
  }

  modifier onlyAdmin(address userAddress){
    require(UserData[msg.sender].accountExist &&  UserData[userAddress].accountExist && UserData[msg.sender].role == Role.Admin, "caller role is not Admin or user doesn't exist");
      _;
  }

//   modifier only(address userAddress){
//     require(UserData[msg.sender].accountExist &&  UserData[userAddress].accountExist && UserData[msg.sender].role == Role.Admin, "caller role is not Admin or user doesn't exist");
//       _;
//   }

 modifier canUserAddProject(){
     require(UserData[msg.sender].accountExist,"Account Doesn't exist");
     require(UserData[msg.sender].isUserActive,"User Not Active");
     require(UserData[msg.sender].role == Role.ProjectOwner || UserData[msg.sender].role == Role.ProjectOwnerAndInvestor || UserData[msg.sender].role == Role.Admin,"User role lack project owner capability");
      _;
  }
  
  modifier isEligibleInvestor(){
      require(UserData[msg.sender].accountExist && UserData[msg.sender].isUserActive, "Account Doesn't exist or user not active");
      require(UserData[msg.sender].userBankDetails.isAccountVerified = true, "User bank account details not verified");
     _;
  }

//constructor function to set SuperUser
constructor(string memory name, string memory email,string memory  dob) public{
    SuperUser = msg.sender;
    UserData[msg.sender].role = Role.Admin;
    createProfile(name,email,dob,1,msg.sender);
}

  function getEnumValue(uint8 role) public returns(Role){
      if(role == 1 ){
          return Role.Admin;
      }else if(role == 2 ){
          return Role.ProjectOwnerAndInvestor;
      } else if(role == 3){
          return Role.ProjectOwner;
      }else if(role == 4 ){
          return Role.Investor;
      }else {
           revert("Invalid Input role");
      }
  }
  //creating user/admin profile

//we will use useradd variable only in case of when admin wants to add admin else it will be discarded
function createProfile(string memory name, string memory email,string memory  dob, uint8 role, address userAdd) public { 
      require(bytes(name).length >0 && bytes(email).length>0  && bytes(dob).length>0, "some element is empty");
      //First part condn for general user and 2nd for Admin
      require(UserData[msg.sender].accountExist == false ||  UserData[msg.sender].role == Role.Admin,"user already associated with this address");
      Role userRole = getEnumValue(role);
      if(userRole == Role.Admin){
          require(UserData[msg.sender].role == Role.Admin, "Creating user with Admin role requires Caller to be Admin");
          require(userAdd != address(0),"should not be zero Addrress    ");
          require(UserData[userAdd].accountExist == false,"Account already exist");
      }else{
         require(UserData[msg.sender].accountExist == false, "Admin cannot create general user");
          userAdd = msg.sender;
      }
      UserData[userAdd].name = name;
      UserData[userAdd].email = email;
      UserData[userAdd].dob = dob;
      UserData[userAdd].role = userRole;
      UserData[userAdd].accountExist = true;
  }

   function updateProfile(string memory name, string memory email,string memory  dob, uint8 role) public returns(UserInfo memory) {
    //   require(bytes(name).length >0 && bytes(email).length>0  && bytes(dob).length>0, "some element is empty");
    require(UserData[msg.sender].accountExist,"account doesn't exist");
      if(bytes(name).length > 0){
      UserData[msg.sender].name = name;
      }
      if(bytes(email).length > 0){
        UserData[msg.sender].email = email;
      }
      if(bytes(dob).length > 0){
        UserData[msg.sender].dob = dob;
      }
      if(role > 0){
          Role userRole = getEnumValue(role);
          require(userRole != Role.Admin,"You already have that privillaged");
          // A projectownerAndInvestor cann't be admin
          if(UserData[msg.sender].role != Role.ProjectOwnerAndInvestor && UserData[msg.sender].role != Role.Admin){
          // if the user is ProjectOwner and request to be investor make him ProjectOwnerAndInvestor and vice verca
              if(UserData[msg.sender].role == Role.ProjectOwner && userRole == Role.Investor || UserData[msg.sender].role == Role.Investor && userRole == Role.ProjectOwner ){
                   UserData[msg.sender].role = Role.ProjectOwnerAndInvestor;
              }
          }
      }
      return UserData[msg.sender];
  }

//Adin will use this to activate or deactivate user
  function activateORdeactivateUser(address userAddress, bool isUserActive,string memory kycDocHash) public onlyAdmin(userAddress) returns(bool){
      UserData[userAddress].isUserActive = isUserActive;
      if(bytes(kycDocHash) .length > 0){
        UserData[userAddress].kycDocHash = kycDocHash;
      }
      return UserData[userAddress].isUserActive;
  }

// ==================================== ProjectRelated ==========================================\\
// Used by Project Owner to list the project 
 function createProject(string memory projectName, string memory projectId, uint projectCost, uint monthlyPercentage) public canUserAddProject {
    require(bytes(projectName).length > 0 && bytes(projectId).length > 0 && projectCost > 0 && monthlyPercentage > 0, "some element is empty");
    projectIdSc++;
    projectIds[projectId] = projectIdSc;
    UserData[msg.sender].projectListed.push(projectIdSc);
    UserWiseProjectCreated[msg.sender][projectIdSc].projectName = projectName;
    UserWiseProjectCreated[msg.sender][projectIdSc].projectId = projectId;
    UserWiseProjectCreated[msg.sender][projectIdSc].projectCost = projectCost;
    UserWiseProjectCreated[msg.sender][projectIdSc].monthlyPercentage = monthlyPercentage;
    UserWiseProjectCreated[msg.sender][projectIdSc].canChangeDetails = true;
  }

//get all the projects of a user
  function getMyListedProject(address userAddress) public onlyAdmin(userAddress) returns(string[] memory){
      require(UserData[msg.sender].accountExist && UserData[msg.sender].accountExist,"Account doesn't exist");
    //   if(UserData[msg.sender].role == Role.admin)
    uint[] memory projectListedOfUser = UserData[userAddress].projectListed;
    if(projectListedOfUser.length > 0){
        string[] storage projectInstance;
        for(uint i = 0; i < projectListedOfUser.length; i++){
            projectInstance.push(UserWiseProjectCreated[userAddress][projectListedOfUser[i]]);
        }
        return projectInstance;
    }
  }

//   function negotiateProjectMaturirityCost(){

//   }
  
//   function investInProject() public isEligibleInvestor returns(bool) {

    
//   }



//=============================UTILITIES============================//
    function getprojectIdIndexFromUsernfo(address userAddress) public returns(uint) {
       require(UserData[userAddress].accountExist);
        UserData[userAddress].projectInvestedIn.length++;
            UserData[userAddress].projectInvestedIn[0]=12;
          return UserData[userAddress].projectInvestedIn[1];

        // if(UserData[userAddress].projectIds.length){
        // }
    }

    function testdatatypes(address useraddress) public returns(bool){
        UserData[msg.sender].userBankDetails.isAccountVerified = true;
      return UserData[msg.sender].userBankDetails.isAccountVerified;
    }


}