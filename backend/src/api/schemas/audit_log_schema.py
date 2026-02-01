"""
Audit Log Schemas - Marshmallow schemas for audit log API (FR-37)
"""

from marshmallow import Schema, fields, validate


class AuditLogCreateRequestSchema(Schema):
    """Schema for creating an audit log entry"""
    account_id = fields.Int(allow_none=True, metadata={'description': "Account ID of user performing action (null for system)"})
    action_type = fields.Str(required=True, validate=validate.OneOf([
        'create', 'update', 'delete', 'approve', 'suspend', 'login', 'logout'
    ]), metadata={'description': "Action type"})
    entity_type = fields.Str(required=True, validate=validate.OneOf([
        'account', 'clinic', 'patient', 'doctor', 'ai_config', 'subscription'
    ]), metadata={'description': "Entity type"})
    entity_id = fields.Int(allow_none=True, metadata={'description': "ID of entity being modified"})
    old_values = fields.Dict(allow_none=True, metadata={'description': "Old values (JSON)"})
    new_values = fields.Dict(allow_none=True, metadata={'description': "New values (JSON)"})
    description = fields.Str(allow_none=True, metadata={'description': "Description"})
    ip_address = fields.Str(allow_none=True, metadata={'description': "IP address"})
    user_agent = fields.Str(allow_none=True, metadata={'description': "User agent"})


class AuditLogResponseSchema(Schema):
    """Schema for audit log response"""
    audit_log_id = fields.Int(required=True, metadata={'description': "Unique audit log ID"})
    account_id = fields.Int(allow_none=True, metadata={'description': "Account ID"})
    action_type = fields.Str(required=True, metadata={'description': "Action type"})
    entity_type = fields.Str(required=True, metadata={'description': "Entity type"})
    entity_id = fields.Int(allow_none=True, metadata={'description': "Entity ID"})
    old_values = fields.Raw(allow_none=True, metadata={'description': "Old values"})
    new_values = fields.Raw(allow_none=True, metadata={'description': "New values"})
    description = fields.Str(allow_none=True, metadata={'description': "Description"})
    ip_address = fields.Str(allow_none=True, metadata={'description': "IP address"})
    user_agent = fields.Str(allow_none=True, metadata={'description': "User agent"})
    created_at = fields.DateTime(required=True, metadata={'description': "Created at"})


class AuditLogSearchRequestSchema(Schema):
    """Schema for audit log search query parameters"""
    account_id = fields.Int(allow_none=True)
    action_type = fields.Str(allow_none=True, validate=validate.OneOf([
        'create', 'update', 'delete', 'approve', 'suspend', 'login', 'logout'
    ]))
    entity_type = fields.Str(allow_none=True, validate=validate.OneOf([
        'account', 'clinic', 'patient', 'doctor', 'ai_config', 'subscription'
    ]))
    entity_id = fields.Int(allow_none=True)
    start_date = fields.Date(allow_none=True)
    end_date = fields.Date(allow_none=True)
    limit = fields.Int(load_default=50, validate=validate.Range(min=1, max=1000))
    offset = fields.Int(load_default=0, validate=validate.Range(min=0))
