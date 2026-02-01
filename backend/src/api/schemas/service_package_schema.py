from marshmallow import Schema, fields, validate

class ServicePackageCreateRequestSchema(Schema):
    """Schema for creating a Service Package"""
    name = fields.Str(required=True, metadata={'description': "Package name"})
    price = fields.Decimal(required=True, as_string=True, metadata={'description': "Package price"})
    image_limit = fields.Int(required=True, metadata={'description': "Number of images allowed"})
    duration_days = fields.Int(required=True, metadata={'description': "Package duration in days"})
    package_type = fields.Str(required=True, validate=validate.OneOf(['clinic', 'patient']),
                             metadata={'description': "clinic = gói cho phòng khám, patient = gói cho người dùng"})

class ServicePackageUpdateRequestSchema(Schema):
    """Schema for updating a Service Package"""
    name = fields.Str(metadata={'description': "Package name"})
    price = fields.Decimal(as_string=True, metadata={'description': "Package price"})
    image_limit = fields.Int(metadata={'description': "Number of images allowed"})
    duration_days = fields.Int(metadata={'description': "Package duration in days"})
    package_type = fields.Str(validate=validate.OneOf(['clinic', 'patient']), metadata={'description': "clinic | patient"})

class ServicePackageResponseSchema(Schema):
    """Schema for Service Package response"""
    package_id = fields.Int(required=True, metadata={'description': "Unique package identifier"})
    name = fields.Str(required=True, metadata={'description': "Package name"})
    price = fields.Decimal(required=True, as_string=True, metadata={'description': "Package price"})
    image_limit = fields.Int(required=True, metadata={'description': "Number of images allowed"})
    duration_days = fields.Int(required=True, metadata={'description': "Package duration in days"})
    package_type = fields.Str(required=True, metadata={'description': "clinic | patient"})

