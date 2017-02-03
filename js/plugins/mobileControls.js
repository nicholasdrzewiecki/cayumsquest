Phaser.Plugin.mobileControls = function(game, parent) {
    Phaser.Plugin.call(this, game, parent);
    this.game = game;
};

Phaser.Plugin.mobileControls.prototype = Object.create(Phaser.Plugin.prototype);

Phaser.Plugin.mobileControls.prototype.constructor = Phaser.Plugin.mobileControls;

Phaser.Plugin.mobileControls.prototype.setup = function(player, buttons) {
    // Define reference for player
    this.player = player;

    // Object in the player that keeps track of which buttons have been pressed
    this.player.buttonsPressed = this.player.buttonsPressed || {};

    // Size of buttons is relative to screen size
    this.buttonHeight = 0.05 * this.game.width;
    this.buttonWidth = this.buttonHeight;
    // this.sizeOfActionButton = 0.5 * this.buttonHeight;
    this.distanceFromEdge = 0.5 * this.buttonHeight;

    // Position of buttons
    var leftX = this.distanceFromEdge;
    var leftY = this.game.height - this.distanceFromEdge - this.buttonWidth - this.buttonHeight;

    var rightX = this.distanceFromEdge + this.buttonHeight + this.buttonWidth;
    var rightY = this.game.height - this.distanceFromEdge - this.buttonWidth - this.buttonHeight;

    var upX = this.distanceFromEdge + this.buttonWidth + this.buttonHeight;
    var upY = this.game.height - this.distanceFromEdge - 2 * this.buttonWidth - this.buttonHeight;

    var downX = this.distanceFromEdge + this.buttonWidth + this.buttonHeight;
    var downY = this.game.height - this.distanceFromEdge - this.buttonWidth;

    // Bitmap buttons
    this.bitmapDirection = this.game.add.bitmapData(this.buttonWidth, this.buttonHeight);
    this.bitmapDirection.ctx.fillStyle = "#e5e5e5";
    this.bitmapDirection.ctx.fillRect(0, 0, this.buttonWidth, this.buttonHeight);

    /* Diagonal buttons
    this.bitmapDiagonal = this.game.add.bitmapData(this.buttonWidth, this.buttonHeight);
    this.bitmapDiagonal.ctx.fillStyle = "#f2f2f2";
    this.bitmapDiagonal.ctx.fillRect(0, 0, this.buttonWidth, this.buttonHeight);

    Action button
    this.bitmapAction = this.game.add.bitmapData(this.sizeOfActionButton, this.sizeOfActionButton);
    this.bitmapAction.ctx.fillStyle = "#f2f2f2";
    this.bitmapAction.ctx.fillRect(0, 0, this.sizeOfActionButton, this.sizeOfActionButton);
    */

    if (buttons.left) {
        this.leftArrow = this.game.add.button(leftX, leftY, this.bitmapDirection);
        this.leftArrow.alpha = 0.2;
        this.leftArrow.fixedToCamera = true;

        this.leftArrow.events.onInputDown.add(function() {
            this.player.buttonsPressed.left = true;
        }, this);

        this.leftArrow.events.onInputUp.add(function() {
            this.player.buttonsPressed.left = false;
        }, this);

        this.leftArrow.events.onInputOver.add(function() {
            this.player.buttonsPressed.left = true;
        }, this);

        this.leftArrow.events.onInputOut.add(function() {
            this.player.buttonsPressed.left = false;
        }, this);
    }

    if (buttons.right) {
        this.rightArrow = this.game.add.button(rightX, rightY, this.bitmapDirection);
        this.rightArrow.alpha = 0.2;
        this.rightArrow.fixedToCamera = true;

        this.rightArrow.events.onInputDown.add(function() {
            this.player.buttonsPressed.right = true;
        }, this);

        this.rightArrow.events.onInputUp.add(function() {
            this.player.buttonsPressed.right = false;
        }, this);

        this.rightArrow.events.onInputOver.add(function() {
            this.player.buttonsPressed.right = true;
        }, this);

        this.rightArrow.events.onInputOut.add(function() {
            this.player.buttonsPressed.right = false;
        }, this);
    }

    if (buttons.up) {
        this.upArrow = this.game.add.button(upX, upY, this.bitmapDirection);
        this.upArrow.angle = 90;
        this.upArrow.alpha = 0.2;
        this.upArrow.fixedToCamera = true;

        this.upArrow.events.onInputDown.add(function() {
            this.player.buttonsPressed.up = true;
        }, this);

        this.upArrow.events.onInputUp.add(function() {
            this.player.buttonsPressed.up = false;
        }, this);

        this.upArrow.events.onInputOver.add(function() {
            this.player.buttonsPressed.up = true;
        }, this);

        this.upArrow.events.onInputOut.add(function() {
            this.player.buttonsPressed.up = false;
        }, this);
    }

    if (buttons.down) {
        this.downArrow = this.game.add.button(downX, downY, this.bitmapDirection);
        this.downArrow.angle = 90;
        this.downArrow.alpha = 0.2;
        this.downArrow.fixedToCamera = true;

        this.downArrow.events.onInputDown.add(function() {
            this.player.buttonsPressed.down = true;
        }, this);

        this.downArrow.events.onInputUp.add(function() {
            this.player.buttonsPressed.down = false;
        }, this);

        this.downArrow.events.onInputOver.add(function() {
            this.player.buttonsPressed.down = true;
        }, this);

        this.downArrow.events.onInputOut.add(function() {
            this.player.buttonsPressed.down = false;
        }, this);
    }

    /*
        if (buttons.upLeft) {
            this.upLeftArrow = this.game.add.button(leftX, upY, this.bitmapDirection);
            this.upLeftArrow.alpha = 1;
            this.upLeftArrow.fixedToCamera = true;

            this.upLeftArrow.events.onInputDown.add(function() {
                this.player.buttonsPressed.upLeft = true;
            }, this);

            this.upLeftArrow.events.onInputUp.add(function() {
                this.player.buttonsPressed.upLeft = false;
            }, this);

            this.upLeftArrow.events.onInputOver.add(function() {
                this.player.buttonsPressed.upLeft = true;
            }, this);

            this.upLeftArrow.events.onInputOut.add(function() {
                this.player.buttonsPressed.upLeft = false;
            }, this);
        }

        if (buttons.upRight) {
            this.upRightArrow = this.game.add.button(rightX, upY, this.bitmapDirection);
            this.upRightArrow.alpha = 1;
            this.upRightArrow.fixedToCamera = true;

            this.upRightArrow.events.onInputDown.add(function() {
                this.player.buttonsPressed.upRight = true;
            }, this);

            this.upRightArrow.events.onInputUp.add(function() {
                this.player.buttonsPressed.upRight = false;
            }, this);

            this.upRightArrow.events.onInputOver.add(function() {
                this.player.buttonsPressed.upRight = true;
            }, this);

            this.upRightArrow.events.onInputOut.add(function() {
                this.player.buttonsPressed.upRight = false;
            }, this);
        }

        if (buttons.downLeft) {
            this.downLeftArrow = this.game.add.button(leftX, downY, this.bitmapDirection);
            this.downLeftArrow.alpha = 1;
            this.downLeftArrow.fixedToCamera = true;

            this.downLeftArrow.events.onInputDown.add(function() {
                this.player.buttonsPressed.downLeft = true;
            }, this);

            this.downLeftArrow.events.onInputUp.add(function() {
                this.player.buttonsPressed.downLeft = false;
            }, this);

            this.downLeftArrow.events.onInputOver.add(function() {
                this.player.buttonsPressed.downLeft = true;
            }, this);

            this.downLeftArrow.events.onInputOut.add(function() {
                this.player.buttonsPressed.downLeft = false;
            }, this);
        }

        if (buttons.downRight) {
            this.downRightArrow = this.game.add.button(rightX, downY, this.bitmapDirection);
            this.downRightArrow.alpha = 1;
            this.downRightArrow.fixedToCamera = true;

            this.downRightArrow.events.onInputDown.add(function() {
                this.player.buttonsPressed.downRight = true;
            }, this);

            this.downRightArrow.events.onInputUp.add(function() {
                this.player.buttonsPressed.downRight = false;
            }, this);

            this.downRightArrow.events.onInputOver.add(function() {
                this.player.buttonsPressed.downRight = true;
            }, this);

            this.downRightArrow.events.onInputOut.add(function() {
                this.player.buttonsPressed.downRight = false;
            }, this);
        }

        if (buttons.action) {
            var actionX = this.game.width - this.distanceFromEdge - this.sizeOfActionButton;
            var actionY = this.game.height - this.distanceFromEdge - this.buttonWidth - this.buttonHeight;

            this.actionButton = this.game.add.button(actionX, actionY, this.bitmapAction);
            this.actionButton.alpha = 0.8;
            this.actionButton.fixedToCamera = true;

            this.actionButton.events.onInputDown.add(function() {
                player.buttonsPressed.action = true;
            }, this);

            this.actionButton.events.onInputUp.add(function() {
                player.buttonsPressed.action = false;
            }, this);
        }

    */
};

Phaser.Plugin.mobileControls.prototype.stopMovement = function() {
    this.player.buttonsPressed = {};
};
