def sync_child_m2m_instances(instance, field_name, child_instances):
    existing_instances = getattr(instance, field_name).all()
    for child in child_instances:
        if child not in existing_instances:
            getattr(instance, field_name).add(child)
    for ex in existing_instances:
        if ex not in child_instances:
            getattr(instance, field_name).remove(ex)
