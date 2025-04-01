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

2. ✅ Host Display Format:
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
   - Invite co-hosts through network or email.
   - Invitees can be registered or non-registered users.
2. Invitee receives email with:
   - Event details
   - A link to the event
   - A link to accept the invitation (with a unique token)
3. Upon acceptance, user is added to event's hosts array

### Database (schema.prisma):

We need a way to track pending host invitations. Let's add a HostInvitation model. It will need fields like:
id: A unique token for the invitation link/acceptance.
eventId: To link to the specific event.
invitedUserId: To link to the user being invited (optional since the user might not be registered).
invitedUserEmail: The email we will send the invite to.
inviterId: To know who sent the invitation.
createdAt: Standard timestamp.

### Backend (src/server/api/routers/events.ts):

emailInviteHost Mutation:
Takes event ID and a list of emails.
Crucially, it first checks which emails correspond to existing, registered users.
It filters out emails not belonging to registered users and potentially informs the inviter.
It checks that the invited users aren't already hosts.
For valid emails/users, it creates records in the HostInvitation table with unique tokens.
Sends the new "Invite to Host" email (containing the acceptance link with the token) to those users.
networkInviteHost Mutation:
Takes event ID and a list of userIds from the network.
Checks that the invited users aren't already hosts.
Creates records in the HostInvitation table.
Sends the "Invite to Host" email.
acceptHostInvite Mutation:
Takes an invitation token.
Verifies the token exists in HostInvitation.
Adds the invitedUserId to the hosts relation for the eventId.
Deletes the HostInvitation record (or marks it as accepted).
Returns success/failure.

### Token Generation

- A unique token is generated for each invitation (e.g., using `ctx.nanoId()`).
- This token is included in the acceptance link.
- The token is stored in the database.

### Email Template

- Create a new email template (`emails/HostInviteEmail.tsx`) similar to `InviteEmail.tsx`.
- Include text like "You've been invited to co-host [Event Title]".
- Include a link to the event and an "Accept Invitation" button/link with the token.

### Frontend Components

- Create a new `InviteHostDialog.tsx` component similar to `Invite.tsx` but for co-host invites.
- Include tabs for "Network" and "Email" invites.
- Remove the "Link" tab as it's not applicable for co-host invites.
- The "Network" tab will use a component similar to `NetworkInvite` but call the `networkInviteHost` mutation.
- The "Email" tab will use a component similar to `EmailInvite` but call the `emailInviteHost` mutation.

### Acceptance Page

- Create a new page (`pages/events/[eventId]/accept-host.tsx`) that:
  - Extracts the `token` from the URL query.
  - Displays "You've been invited to co-host [Event Title]".
  - Shows event details.
  - Has an "Accept" button that calls the `acceptHostInvite` mutation with the token.
  - Shows success (redirecting to the event page) or error messages.

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

## Implementation Phases

### Phase 1: Database and Core Logic (In Progress)

- ✅ Database schema changes
- ✅ Update existing code to use event.hosts[0] as temporary solution
- ✅ Manual testing of basic app functionality
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

3. **Database Changes:**

   - Add a `HostInvitation` model to `schema.prisma` to track pending invitations.
   - Run `npx prisma migrate dev --name add_host_invitation`.

4. **Backend Mutations:**

   - Implement `emailInviteHost` and `networkInviteHost` mutations in `src/server/api/routers/events.ts`.
   - Implement `acceptHostInvite` mutation.

5. **Email Template:**

   - Create `emails/HostInviteEmail.tsx`.

6. **Frontend Components:**

   - Create `InviteHostDialog.tsx` and its sub-components.

7. **Acceptance Page:**

   - Create `pages/events/[eventId]/accept-host.tsx`.

8. **Testing:**
   - Test the entire flow, including inviting both registered and non-registered users.
