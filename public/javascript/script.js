// When the DOM is ready, init the scripts.
        $(function(){
            // Get a reference to the app mode note.
            var appModeNote = $( "#appModeNote" );
            // Get a reference to the body.
            var body = $( document.body );
            // Check to see if the window is running in app mode. If
            // it is not, then we want to show the app mode note and
            // bind some event listeners to the scroll.
            if (
                ("standalone" in window.navigator) &&
                !window.navigator.standalone
                ){
                // This user is running in a "full screen ready"
                // device, but is NOT using the full screen mode.
                // Show the note about full screen.
                appModeNote.show();
                // Now that we have shown the note, we want to bind
                // some special events to get rid of the note when
                // the user tries to interact with the application.
                //
                // We are going to bind the touchStart and touchMove
                // events such that when the user triggers these
                // events, we will hide the app mode note.
                //
                // Notice that we are using nameSpaced events. This
                // is to ensure that when we unbind the events (after
                // the app mode note is removed), we don't remove any
                // other critical event bindints.
                body.bind(
                    "touchstart.appModeNote touchmove.appModeNote",
                    function( event ){
                        // Prevent the default events. We are doing
                        // this both to bring the note to the users
                        // attention... and because FIXED position
                        // elements on the "view port" are not truly
                        // fixed.
                        event.preventDefault();
                        // Unbind the current event handler such that
                        // the user's next attempt to interact with
                        // the screen is successful.
                        body.unbind( "touchstart.appModeNote touchmove.appModeNote" );
                        // Fade out the app mode, full screen note.
                        appModeNote.fadeOut( 500 );
                    }
                );
            }
        });