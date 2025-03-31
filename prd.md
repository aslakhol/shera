# Co-Hosting Feature PRD

## Overview

Add support for multiple hosts (co-hosts) to events in Shera, where all hosts have equal permissions and capabilities.

## Feature Details

### Core Functionality

- All hosts have equal permissions and capabilities
- No limit on number of co-hosts per event
- Cannot remove the last host from an event

### User Interface

1. Edit Event Page Updates:

   - Add "Hosts" section
   - Display list of current hosts with remove buttons
   - Add "Invite Co-host" button
   - Use existing invite component (network/email/link) for co-host invitations

2. Host Display Format:
   - For 3 or fewer hosts: "Hosted by [name1], [name2] and [name3]"
   - For more than 3 hosts: "Hosted by [name1] and X others"

### Technical Implementation

#### ✅ Database Changes

1. Modify Event model in schema.prisma:

```prisma
model Event {
    // ... existing fields ...
    hosts     User[]    @relation("EventHosts")
    // remove existing hostId and host fields
}
```

#### New Components/Pages Needed

1. Co-host invitation email template
2. Co-host invitation acceptance page
3. Hosts management section in EditEvent component

#### ✅ Required Changes to Existing Code

1. ✅ Update Event queries and mutations to handle multiple hosts
2. ✅ Modify access control checks in EditEvent and similar components
3. ✅ Update email system to handle multiple hosts
4. ✅ Update posts system to handle multiple hosts

### Invitation Flow

1. From Edit Event page, existing hosts can:
   - Invite co-hosts through network, email, or shareable link
   - Only registered users can be co-hosts
2. Invitee receives email with:
   - Event details
   - Accept invitation link
   - Link to event
3. Upon acceptance, user is added to event's hosts array

### ✅ Migration Plan

1. ✅ Database Migration Steps:
   ```sql
   -- Create new hosts relation table
   -- Copy existing host relationships
   -- Remove old host columns
   ```
2. ✅ Code Deployment Steps:
   a. Deploy database changes
   b. Deploy application changes
   c. Run migration script to convert existing events

### Testing Requirements

1. Host Management
   - Adding/removing hosts
   - Preventing removal of last host
2. Permissions
   - Verify all hosts have equal permissions
   - Test all host actions with different hosts
3. Invitations
   - Test all invitation methods
   - Verify email delivery
   - Test invitation acceptance flow
4. Migration
   - Test migration script on staging
   - Verify existing events maintain their hosts

## Implementation Phases

### Phase 1: Database and Core Logic (In Progress)

- ✅ Database schema changes
- ✅ Update existing code to use event.hosts[0] as temporary solution
- ⏳ Manual testing of basic app functionality
- ✅ Migration script development

### Phase 2: UI Implementation

- Edit Event page updates
- Host management interface
- Invitation UI integration

### Phase 3: Invitation System

- Co-host email template
- Invitation acceptance flow
- Integration with existing invite system

### Phase 4: Testing and Migration

- Comprehensive testing
- Production migration execution
- Monitoring and verification

## Next Steps

1. Complete Phase 1:

   - Perform manual testing of the app to verify all basic functionality works with the new hosts relationship
   - Test creating new events
   - Test viewing existing events
   - Test posting in events
   - Test email notifications

2. Begin Phase 2:
   - Start designing the hosts management UI in the Edit Event page
   - Plan the co-host invitation flow
