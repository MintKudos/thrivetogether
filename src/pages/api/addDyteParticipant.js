// src/pages/api/addDyteParticipant.js

export async function post(request) {
    // Retrieve the Supabase access token from the request cookies
    const accessToken = request.cookies['sb-access-token'];
  
    if (!accessToken) {
      return {
        status: 401,
        body: { error: 'No access token found in cookies' }
      };
    }
  
    // Set the Supabase access token for the session
    supabase.auth.setAuth(accessToken);
  
    // Get the current user's details from Supabase
    const { user, error } = await supabase.auth.api.getUser(accessToken);
  
    if (error) {
      return {
        status: 500,
        body: { error: 'Error retrieving user from Supabase' }
      };
    }
  
    // Set up the Dyte API URL and authorization
    const dyteApiUrl = 'https://api.dyte.io/v2';
    const dyteAuth = Buffer.from(`${process.env.DYTE_ORG_ID}:${process.env.DYTE_APIKEY}`).toString('base64');
  
    // Add the user as a participant to a Dyte meeting
    try {
      const response = await fetch(`${dyteApiUrl}/meetings/YOUR_MEETING_ID/participants`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${dyteAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: user.email, // Assuming 'email' is a unique identifier for your users
          // ... other user details
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to add participant to Dyte meeting');
      }
  
      const participant = await response.json();
  
      // Return success response
      return {
        status: 200,
        body: { message: 'User added as participant to Dyte meeting', participant }
      };
    } catch (error) {
      return {
        status: error.status || 500,
        body: { error: error.message || 'Error adding participant to Dyte meeting' }
      };
    }
  }
  