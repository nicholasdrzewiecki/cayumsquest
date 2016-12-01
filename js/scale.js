var CAYUMSQUEST = CAYUMSQUEST || {}; // Create a namespace

CAYUMSQUEST.getGameLandscapeDimensions = function(maxWidth, maxHeight) {
    var width = window.innerWidth * window.devicePixelRatio;
    var height = window.innerHeight * window.devicePixelRatio;
    var landscapeWidth = Math.max(width, height);
    var landscapeHeight = Math.min(width, height);

    if (landscapeWidth > maxWidth) {
        var ratioWidth = maxWidth / landscapeWidth;
        landscapeWidth *= ratioWidth;
        landscapeHeight *= ratioWidth;
    }

    if (landscapeHeight > maxHeight) {
        var ratioHeight = maxWidth / landscapeWidth;
        landscapeWidth *= ratioHeight;
        landscapeHeight *= ratioHeight;
    }

    return {
        width: landscapeWidth,
        height: landscapeHeight
    };
};
