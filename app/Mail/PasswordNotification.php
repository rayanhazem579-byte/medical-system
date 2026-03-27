<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $username;
    public $password;
    public $role;
    public $email;
    public $customMessage;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $username, $password, $role = 'موظف', $email = null, $customMessage = null)
    {
        $this->name = $name;
        $this->username = $username;
        $this->password = $password;
        $this->role = $role;
        $this->email = $email;
        $this->customMessage = $customMessage;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'بيانات الدخول للنظام | System Login Credentials',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.password_notification',
            with: [
                'name' => $this->name,
                'username' => $this->username,
                'password' => $this->password,
                'role' => $this->role,
                'email' => $this->email,
                'customMessage' => $this->customMessage
            ]
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
